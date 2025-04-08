import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getMdxBySlug, getAllSlugs } from "@/lib/mdx"
import { formatDate } from "@/lib/utils"
import { MDXRemote } from "next-mdx-remote/rsc"

export async function generateStaticParams() {
  const allSlugs = await getAllSlugs()

  return allSlugs.map((item) => ({
    collection: item.collection,
    slug: item.slug,
  }))
}

export default async function ArticlePage({ params }: { params: { collection: string; slug: string } }) {
  const article = await getMdxBySlug(params.collection, params.slug)

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href={`/collections/${params.collection}`}
        className="flex items-center text-muted-foreground mb-6 hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {article.collectionTitle}
      </Link>

      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <h1>{article.frontmatter.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground not-prose mb-8">
          <time dateTime={article.frontmatter.date}>{formatDate(article.frontmatter.date, true)}</time>

          {article.frontmatter.sequence !== undefined && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                Sequence: {article.frontmatter.sequence}
              </span>
            </div>
          )}

          {article.frontmatter.author && (
            <div className="flex items-center gap-2">
              <span>By {article.frontmatter.author}</span>
            </div>
          )}
        </div>

        {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 not-prose">
            {article.frontmatter.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <MDXRemote source={article.content} />
      </article>
    </div>
  )
}
