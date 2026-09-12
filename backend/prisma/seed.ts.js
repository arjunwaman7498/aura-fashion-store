import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Ivory Embroidered Saree",
    description: "Elegant ivory saree with delicate embroidery, perfect for festive and special occasions.",
    category: "Sarees",
    price: 4999,
    salePrice: 3999,
    sizes: ["S", "M", "L"],
    stock: 15,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Rose Silk Saree",
    description: "Graceful rose-toned silk saree designed for an elegant traditional look.",
    category: "Sarees",
    price: 5499,
    salePrice: null,
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Blush Printed Kurti",
    description: "Comfortable blush printed kurti suitable for everyday and casual wear.",
    category: "Kurtis",
    price: 1899,
    salePrice: 1499,
    sizes: ["XS", "S", "M", "L"],
    stock: 20,
    image: "https://images.unsplash.com/photo-1741847639057-b51a25d42892?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Ivory Straight Kurti",
    description: "Minimal ivory straight kurti with a clean and sophisticated silhouette.",
    category: "Kurtis",
    price: 2199,
    salePrice: null,
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Floral Midi Dress",
    description: "Feminine floral midi dress designed for relaxed outings and casual occasions.",
    category: "Dresses",
    price: 2999,
    salePrice: 2399,
    sizes: ["XS", "S", "M", "L"],
    stock: 14,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Satin Evening Dress",
    description: "Elegant satin evening dress with a refined finish for special occasions.",
    category: "Dresses",
    price: 4499,
    salePrice: null,
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Pastel Festive Lehenga",
    description: "Beautiful pastel lehenga crafted for festive celebrations and wedding events.",
    category: "Lehengas",
    price: 8999,
    salePrice: 7499,
    sizes: ["S", "M", "L"],
    stock: 8,
    image: "https://images.unsplash.com/photo-1693336431373-70bf946433a7?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Rose Gold Lehenga",
    description: "Luxurious rose gold lehenga with an elegant festive appearance.",
    category: "Lehengas",
    price: 10999,
    salePrice: null,
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    image: "https://images.unsplash.com/photo-1781077127258-2f3f22cf5d5e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Classic Cotton Saree",
    description: "Lightweight cotton saree offering comfortable traditional everyday styling.",
    category: "Sarees",
    price: 2799,
    salePrice: 2299,
    sizes: ["S", "M", "L"],
    stock: 22,
    image: "https://images.unsplash.com/photo-1750008558677-f1f225adba74?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Printed Everyday Kurti",
    description: "Versatile printed kurti made for comfortable everyday wear.",
    category: "Kurtis",
    price: 1599,
    salePrice: null,
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 25,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Linen Summer Dress",
    description: "Breathable linen summer dress designed for a fresh and comfortable look.",
    category: "Dresses",
    price: 3299,
    salePrice: 2799,
    sizes: ["XS", "S", "M", "L"],
    stock: 16,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Embroidered Wedding Lehenga",
    description: "Statement wedding lehenga featuring elegant embroidery for grand occasions.",
    category: "Lehengas",
    price: 12999,
    salePrice: 10999,
    sizes: ["S", "M", "L", "XL"],
    stock: 5,
    image: "https://images.unsplash.com/photo-1638456265353-ecfff630cfd4?auto=format&fit=crop&w=700&q=80",
  },
];

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });