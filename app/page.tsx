import Link from "next/link"
import { getFeaturedCollections } from "@/lib/collections"
import { siteConfig } from "@/config/site"

export default async function Home() {
  const collections = await getFeaturedCollections()

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to {siteConfig.name}</h1>
        <p className="text-xl text-muted-foreground mb-6">{siteConfig.description}</p>
        <Link
          href="/collections"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Collections
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div key={collection.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
              <p className="text-muted-foreground mb-4">{collection.description}</p>
              <p className="text-sm text-muted-foreground mb-4">{collection.count} items</p>
              <Link href={`/collections/${collection.slug}`} className="text-primary hover:underline">
                Browse Collection →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
