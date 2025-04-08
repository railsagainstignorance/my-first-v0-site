import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { siteConfig } from "@/config/site"
import { parseDate } from "./utils"

const contentDirectory = path.join(process.cwd(), "content")

export type CollectionMeta = {
  slug: string
  title: string
  description: string
  count: number
  useSequence?: boolean
}

export type CollectionItem = {
  slug: string
  title: string
  date: string
  sequence?: number
  excerpt?: string
  tags?: string[]
}

export type Collection = {
  slug: string
  title: string
  description: string
  useSequence?: boolean
  items: CollectionItem[]
}

/**
 * Get metadata for all collections
 * @param onlyEnabled If true, only returns collections enabled in site config
 */
export async function getAllCollections(onlyEnabled = true): Promise<CollectionMeta[]> {
  try {
    const collections = await fs.readdir(contentDirectory)

    let collectionsData = await Promise.all(
      collections.map(async (collectionDir) => {
        const collectionPath = path.join(contentDirectory, collectionDir)
        const stat = await fs.stat(collectionPath)

        if (!stat.isDirectory()) return null

        // Skip if only enabled collections are requested and this one isn't enabled
        if (onlyEnabled && !siteConfig.collections.enabled.includes(collectionDir)) {
          return null
        }

        // Read the collection's _index.md file for metadata
        const indexPath = path.join(collectionPath, "_index.md")
        try {
          const indexContent = await fs.readFile(indexPath, "utf8")
          const { data } = matter(indexContent)

          // Count items in the collection
          const items = await fs.readdir(collectionPath)
          const itemCount = items.filter((item) => item !== "_index.md").length

          return {
            slug: collectionDir,
            title: data.title || collectionDir,
            description: data.description || "",
            count: itemCount,
            useSequence: data.useSequence || false,
          }
        } catch (error) {
          // If no _index.md, use directory name as title
          return {
            slug: collectionDir,
            title: collectionDir,
            description: "",
            count: 0,
            useSequence: false,
          }
        }
      }),
    )

    collectionsData = collectionsData.filter(Boolean) as CollectionMeta[]

    // Sort collections according to the order specified in the enabled array
    if (onlyEnabled) {
      collectionsData.sort((a, b) => {
        const orderA = siteConfig.collections.enabled.indexOf(a.slug)
        const orderB = siteConfig.collections.enabled.indexOf(b.slug)

        // Both collections should be in the enabled array at this point
        return orderA - orderB
      })
    } else {
      // For all collections (including non-enabled ones),
      // put enabled ones first in their specified order, then others alphabetically
      collectionsData.sort((a, b) => {
        const orderA = siteConfig.collections.enabled.indexOf(a.slug)
        const orderB = siteConfig.collections.enabled.indexOf(b.slug)

        // If both collections are in the enabled array
        if (orderA !== -1 && orderB !== -1) {
          return orderA - orderB
        }

        // If only one collection is in the enabled array
        if (orderA !== -1) return -1
        if (orderB !== -1) return 1

        // If neither collection is in the enabled array, sort alphabetically
        return a.title.localeCompare(b.title)
      })
    }

    return collectionsData
  } catch (error) {
    console.error("Error getting collections:", error)
    return []
  }
}

/**
 * Get featured collections for the homepage
 */
export async function getFeaturedCollections(): Promise<CollectionMeta[]> {
  const allCollections = await getAllCollections(true)

  if (siteConfig.collections.featured.length > 0) {
    // Filter to only include featured collections in the specified order
    const featuredCollections = siteConfig.collections.featured
      .map((slug) => allCollections.find((collection) => collection.slug === slug))
      .filter(Boolean) as CollectionMeta[]

    return featuredCollections
  }

  // If no featured collections specified, return the first 3 (or fewer)
  return allCollections.slice(0, 3)
}

/**
 * Get a specific collection with its items
 */
export async function getCollection(slug: string): Promise<Collection | null> {
  try {
    const collectionPath = path.join(contentDirectory, slug)

    try {
      await fs.access(collectionPath)
    } catch {
      return null // Collection doesn't exist
    }

    // Read collection metadata
    let title = slug
    let description = ""
    let useSequence = false

    try {
      const indexPath = path.join(collectionPath, "_index.md")
      const indexContent = await fs.readFile(indexPath, "utf8")
      const { data } = matter(indexContent)
      title = data.title || slug
      description = data.description || ""
      useSequence = data.useSequence || false
    } catch {
      // No _index.md file, use defaults
    }

    // Read all items in the collection
    const files = await fs.readdir(collectionPath)
    const mdxFiles = files.filter((file) => (file.endsWith(".md") || file.endsWith(".mdx")) && file !== "_index.md")

    const items = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(collectionPath, file)
        const content = await fs.readFile(filePath, "utf8")
        const { data } = matter(content)

        const slug = file.replace(/\.(md|mdx)$/, "")

        return {
          slug,
          title: data.title || slug,
          date: parseDate(data.date), // Use parseDate to handle various date formats
          sequence: typeof data.sequence === "number" ? data.sequence : undefined,
          excerpt: data.excerpt || data.description,
          tags: data.tags || [],
        }
      }),
    )

    // Sort items based on collection configuration
    if (useSequence) {
      // Split items into those with sequence and those without
      const withSequence = items.filter((item) => typeof item.sequence === "number")
      const withoutSequence = items.filter((item) => typeof item.sequence !== "number")

      // Sort items with sequence by sequence value (smallest first)
      withSequence.sort((a, b) => (a.sequence as number) - (b.sequence as number))

      // Sort items without sequence by date (newest first)
      withoutSequence.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Combine the two arrays
      const sortedItems = [...withSequence, ...withoutSequence]

      // Limit items per page if configured
      const itemsPerPage = siteConfig.collections.itemsPerPage || 10
      const limitedItems = sortedItems.slice(0, itemsPerPage)

      return {
        slug,
        title,
        description,
        useSequence,
        items: limitedItems,
      }
    } else {
      // Default sorting by date (newest first)
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Limit items per page if configured
      const itemsPerPage = siteConfig.collections.itemsPerPage || 10
      const limitedItems = items.slice(0, itemsPerPage)

      return {
        slug,
        title,
        description,
        useSequence,
        items: limitedItems,
      }
    }
  } catch (error) {
    console.error(`Error getting collection ${slug}:`, error)
    return null
  }
}
