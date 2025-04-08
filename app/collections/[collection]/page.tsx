import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCollection, getAllCollections } from "@/lib/collections"
import { formatDate } from "@/lib/utils"

export async function generateStaticParams() {
  const collections = await getAllCollections()

  return collections.map((collection) => ({
    collection: collection.slug,
  }))
}

export default async function CollectionPage({ params }: { params: { collection: string } }) {
  const collection = await getCollection(params.collection)

  if (!collection) {
    return <div>Collection not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/collections" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Collections
      </Link>

      <h1 className="text-4xl font-bold mb-2">{collection.title}</h1>
      <p className="text-xl text-muted-foreground mb-8">{collection.description}</p>

      {collection.useSequence && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            This collection uses custom sequence ordering. Items with a sequence number are shown first (in sequence
            order), followed by items without a sequence number (in date order, newest first).
          </p>
        </div>
      )}

      <div className="space-y-6">
        {collection.items.map((item) => (
          <div key={item.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <div className="text-sm text-muted-foreground text-right">
                {typeof item.sequence === "number" && collection.useSequence && (
                  <div className="font-medium">Sequence: {item.sequence}</div>
                )}
                <div>{formatDate(item.date, true)}</div>
              </div>
            </div>
            {item.excerpt && <p className="text-muted-foreground mb-4">{item.excerpt}</p>}
            <div className="flex items-center justify-between">
              <Link href={`/collections/${collection.slug}/${item.slug}`} className="text-primary hover:underline">
                Read More →
              </Link>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
