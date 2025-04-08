/**
 * Site configuration
 * Controls which collections are displayed and in what order
 */
export const siteConfig = {
  name: "Static Publishing Platform",
  description: "A simple static publishing platform with frontmatter and collections",

  // Collections configuration
  collections: {
    // Which collections to display and in what order
    // Collections not listed here will still be accessible via direct URL
    // but won't appear in navigation or listings
    enabled: ["blog", "projects", "guides"],

    // Featured collections to highlight on the homepage
    // If empty, will use the first 3 from enabled collections
    featured: ["blog", "projects"],

    // How many items to show per collection on index pages
    itemsPerPage: 10,
  },

  // Navigation links
  navigation: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/collections/blog" },
    { title: "Projects", href: "/collections/projects" },
    { title: "Guides", href: "/collections/guides" },
  ],
}
