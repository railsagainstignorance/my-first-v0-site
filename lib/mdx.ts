import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { getCollection } from "./collections"
import { parseDate } from "./utils"

const contentDirectory = path.join(process.cwd(), "content")

type Slug = {
  collection: string
  slug: string
}

/**
 * Get all article slugs across all collections
 */
export async function getAllSlugs(): Promise<Slug[]> {
  try {
    const collections = await fs.readdir(contentDirectory)

    const slugs: Slug[] = []

    for (const collection of collections) {
      const collectionPath = path.join(contentDirectory, collection)
      const stat = await fs.stat(collectionPath)

      if (!stat.isDirectory()) continue

      const files = await fs.readdir(collectionPath)
      const mdxFiles = files.filter((file) => (file.endsWith(".md") || file.endsWith(".mdx")) && file !== "_index.md")

      for (const file of mdxFiles) {
        slugs.push({
          collection,
          slug: file.replace(/\.(md|mdx)$/, ""),
        })
      }
    }

    return slugs
  } catch (error) {
    console.error("Error getting all slugs:", error)
    return []
  }
}

/**
 * Get MDX content by slug
 */
export async function getMdxBySlug(collection: string, slug: string) {
  try {
    const collectionData = await getCollection(collection)

    if (!collectionData) {
      return null
    }

    const filePath = path.join(contentDirectory, collection, `${slug}.md`)
    let fileExists = true

    try {
      await fs.access(filePath)
    } catch {
      fileExists = false
    }

    // If .md doesn't exist, try .mdx
    const mdxPath = path.join(contentDirectory, collection, `${slug}.mdx`)

    if (!fileExists) {
      try {
        await fs.access(mdxPath)
        fileExists = true
      } catch {
        return null // Neither .md nor .mdx exists
      }
    }

    const content = await fs.readFile(fileExists ? filePath : mdxPath, "utf8")
    const { data, content: mdxContent } = matter(content)

    return {
      frontmatter: {
        title: data.title || slug,
        date: parseDate(data.date), // Use parseDate to handle various date formats
        sequence: typeof data.sequence === "number" ? data.sequence : undefined,
        author: data.author,
        tags: data.tags || [],
        ...data,
      },
      content: mdxContent,
      collectionTitle: collectionData.title,
    }
  } catch (error) {
    console.error(`Error getting MDX for ${collection}/${slug}:`, error)
    return null
  }
}
