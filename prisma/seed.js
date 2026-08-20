/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const DEMO = "https://res.cloudinary.com/demo/image/upload";

const designs = [
  { title: "Full-hand bridal mandala", category: "BRIDAL", publicId: "samples/people/jazz", featured: true, order: 1 },
  { title: "Bridal palms with paisley", category: "BRIDAL", publicId: "samples/people/bicycle", featured: true, order: 2 },
  { title: "Flowing arabic vine", category: "ARABIC", publicId: "samples/landscapes/nature-mountains", featured: true, order: 3 },
  { title: "Arabic bracelet trail", category: "ARABIC", publicId: "samples/landscapes/beach-boat", featured: false, order: 4 },
  { title: "Minimal finger accents", category: "MINIMAL", publicId: "samples/animals/cat", featured: true, order: 5 },
  { title: "Minimal lotus motif", category: "MINIMAL", publicId: "samples/animals/dog", featured: false, order: 6 },
  { title: "Glitter festival glam", category: "GLITTER", publicId: "samples/food/dessert", featured: true, order: 7 },
  { title: "Glitter back-hand sparkle", category: "GLITTER", publicId: "samples/food/pot-mussels", featured: false, order: 8 },
  { title: "Kids party florals", category: "KIDS", publicId: "samples/animals/kitten-playing", featured: true, order: 9 },
  { title: "Kids butterfly fun", category: "KIDS", publicId: "samples/animals/reindeer", featured: false, order: 10 },
  { title: "Festive half-hand jaali", category: "FESTIVE", publicId: "samples/landscapes/girl-urban-view", featured: false, order: 11 },
  { title: "Festive peacock plume", category: "FESTIVE", publicId: "sample", featured: true, order: 12 },
];

const courses = [
  {
    title: "Beginner Mehndi Foundations",
    slug: "beginner-mehndi-foundations",
    description:
      "A hands-on introduction to cone handling, pressure control, and the core motifs every artist must master. Perfect if you have never held a cone before.",
    curriculumPoints: [
      "Cone making and grip techniques",
      "Lines, dots, and pressure drills",
      "Leaves, paisleys, and florals",
      "Simple full-hand compositions",
    ],
    durationLabel: "2 weeks · 8 sessions",
    price: 4999,
    offerPrice: 3499,
  },
  {
    title: "Bridal Mehndi Mastery",
    slug: "bridal-mehndi-mastery",
    description:
      "Advanced bridal work covering full-arm compositions, dulha-dulhan figures, and speed techniques for real wedding timelines.",
    curriculumPoints: [
      "Bridal layout planning and symmetry",
      "Figurative work: dulha-dulhan, peacocks",
      "Dense jaali and shading techniques",
      "Live model practice with feedback",
    ],
    durationLabel: "4 weeks · 16 sessions",
    price: 11999,
    offerPrice: null,
  },
  {
    title: "Arabic & Minimal Styles Intensive",
    slug: "arabic-minimal-styles-intensive",
    description:
      "Master the flowing, bold-stroke Arabic style and modern minimal finger work that dominates party and engagement bookings.",
    curriculumPoints: [
      "Bold stroke and negative-space control",
      "Vine, trail, and bracelet patterns",
      "Minimal motifs for engagements",
      "Portfolio shoot of your best 5 pieces",
    ],
    durationLabel: "3 weeks · 10 sessions",
    price: 7999,
    offerPrice: 6499,
  },
];

const reviews = [
  {
    name: "Priya S.",
    rating: 5,
    message:
      "My bridal mehndi was beyond anything I imagined. The detailing stayed dark for almost two weeks and every guest asked who did it.",
    isApproved: true,
  },
  {
    name: "Ayesha K.",
    rating: 5,
    message:
      "Took the beginner course with zero experience and left doing full-hand designs. The teaching is patient and genuinely structured.",
    isApproved: true,
  },
  {
    name: "Ritu M.",
    rating: 4,
    message:
      "Booked for my sister's engagement. Elegant Arabic design, done on time, and the stain came out beautifully rich.",
    isApproved: true,
  },
];

async function main() {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      studioName: "Mehndi Studio",
      tagline: "Henna artistry for life's most beautiful moments",
      phone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      instagramUrl: "https://instagram.com/mehndistudio",
      address: "Studio 12, Arts Lane, Mumbai 400050",
      heroImageUrl: "/hero.svg",
      heroImageUrls: ["/hero.svg"],
      heroHeadline: "Intricate henna, unforgettable occasions",
    },
  });

  for (const d of designs) {
    await prisma.design.create({
      data: {
        title: d.title,
        category: d.category,
        imageUrl: `${DEMO}/${d.publicId}.jpg`,
        cloudinaryPublicId: d.publicId,
        isFeatured: d.featured,
        sortOrder: d.order,
      },
    });
  }

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
