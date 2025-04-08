import Link from "next/link"
import { getAllCollections } from "@/lib/collections"

export default async function CollectionsPage() {
  const collections = await getAllCollections()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Collections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-2">{collection.title}</h2>
            <p className="text-muted-foreground mb-4">{collection.description}</p>
            <p className="text-sm text-muted-foreground mb-4">{collection.count} items</p>
            <Link href={`/collections/${collection.slug}`} className="text-primary hover:underline">
              Browse Collection →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
