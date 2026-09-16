export type NewsArticle = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageFit: "cover" | "contain";
  paragraphs: string[];
  sourceUrl: string;
  relatedLink: { href: string; label: string };
};

export const articles: NewsArticle[] = [
  {
    slug: "mundus-vini-gold-medals",
    title: "Gold medals for Badagoni at Mundus Vini",
    category: "Awards",
    date: "2025-11-28",
    excerpt: "Four wines receive gold medals at the international wine competition in Germany.",
    image: "/images/newsroom/mundus-vini.jpg",
    imageAlt: "Badagoni Saperavi Reserve, Kakhetian Noble Red, Alaverdi Tradition Red and Maestro Extra Brut with Mundus Vini gold medals",
    imageWidth: 1600,
    imageHeight: 1600,
    imageFit: "contain",
    paragraphs: [
      "Four Badagoni wines earned gold medals at Mundus Vini in Germany: Saperavi Reserve, Kakhetian Noble dry red, Alaverdi Tradition dry red, and Maestro Extra Brut sparkling wine.",
      "The result brings recognition to both still and sparkling wines in the collection. Among them is Maestro Extra Brut, which received its gold medal within months of its release.",
      "Together, these wines offer different expressions of Badagoni, from its red wines to a more recent addition to the sparkling collection.",
    ],
    sourceUrl: "https://badagoni.com/mundus-vini-germany-badagoni-wines-won-gold-medals-once-again/",
    relatedLink: { href: "/catalogue", label: "Explore the wines" },
  },
  {
    slug: "saperavi-reserve-best-of-show",
    title: "Saperavi Reserve named Best of Show Georgia Red",
    category: "Awards",
    date: "2025-11-28",
    excerpt: "Saperavi Reserve 2010 receives a Best of Show Georgia Red distinction at Mundus Vini’s Summer Tasting.",
    image: "/images/newsroom/saperavi-reserve.jpg",
    imageAlt: "Badagoni Saperavi Reserve with its Mundus Vini Best of Show Georgia Red recognition",
    imageWidth: 594,
    imageHeight: 594,
    imageFit: "contain",
    paragraphs: [
      "Badagoni Saperavi Reserve was awarded Best of Show Georgia Red at Mundus Vini Summer Tasting in Germany. The distinction recognises a limited wine made from the 2010 harvest.",
      "The wine comes from Saperavi grown in Badagoni’s vineyards near Alaverdi Monastery. Its connection to this part of Kakheti is central to the story behind the bottle.",
      "For Badagoni, the result brings further international recognition to Georgian wine and to the character of Saperavi.",
    ],
    sourceUrl: "https://badagoni.com/badagoni-saperavi-reserve-becomes-an-owner-of-the-highest-award-best-of-show-georgia-red/",
    relatedLink: { href: "/wines/saperavi-reserve", label: "About Saperavi Reserve" },
  },
  {
    slug: "sanlian-lifeweek-georgian-wine",
    title: "A Georgian wine story in Sanlian Lifeweek",
    category: "In the press",
    date: "2025-11-28",
    excerpt: "The Chinese magazine explores Georgia’s winemaking heritage, qvevri tradition, and local cuisine.",
    image: "/images/newsroom/sanlian-lifeweek.jpg",
    imageAlt: "Sanlian Lifeweek’s Georgian wine and cuisine feature on a tablet, showing Alaverdi and Badagoni Home",
    imageWidth: 2048,
    imageHeight: 2048,
    imageFit: "contain",
    paragraphs: [
      "Badagoni featured in Sanlian Lifeweek, a Chinese magazine, as part of a story on travel and gastronomy in Georgia.",
      "The feature visits Alaverdi Monastery’s historic cellar and explores traditional qvevri winemaking. It traces the connection between this living tradition and the wines made by the monks.",
      "Nearby, Badagoni Home offers another part of that story through Georgian and Tushetian cuisine. The coverage highlights dishes including kotori and khavitsi, placing food alongside wine in its portrait of the region.",
    ],
    sourceUrl: "https://badagoni.com/badagoni-featured-in-the-influential-chinese-magazine-sanlian-lifeweek/",
    relatedLink: { href: "/alaverdi-monastery-cellar", label: "Discover Alaverdi’s cellar" },
  },
];

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
