export const products = [
  {
    id: "man-polo",
    name: "Men's Polo",
    price: 38,
    category: "Polos",
    modelId: "man-polo-shirt",
    colors: ["#ffffff", "#0A1A17", "#FF6A00", "#1f2937"],
    sizes: ["S", "M", "L", "XL"],
    image: "/models/man-polo-shirt/main.jpg",
    description:
      "Classic men's polo. Soft-touch piqué cotton, ribbed collar.",
  },
  {
    id: "women-polo",
    name: "Women's Polo",
    price: 38,
    category: "Polos",
    modelId: "women-polo-shirt",
    colors: ["#ffffff", "#0A1A17", "#FF6A00", "#f43f5e"],
    sizes: ["XS", "S", "M", "L"],
    image: "/models/women-polo-shirt/main.jpg",
    description:
      "Tailored women's polo. Soft-touch piqué cotton, fitted silhouette.",
  },
  {
    id: "man-hoodie",
    name: "Men's Hoodie",
    price: 52,
    category: "Hoodies",
    modelId: "man-hoodie",
    colors: ["#000000", "#1f2937", "#374151", "#FF6A00", "#ffffff"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/models/man-hoodie/main.jpg",
    description:
      "Premium men's hoodie. Heavyweight cotton blend, adjustable drawstring hood.",
  },
  {
    id: "man-tshirt",
    name: "Men's T-Shirt",
    price: 28,
    category: "T-Shirts",
    modelId: "man-tshirt",
    colors: ["#ffffff", "#000000", "#1f2937", "#6366F1", "#EC4899"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/models/man-tshirt/main.jpg",
    description:
      "Classic men's t-shirt. Premium cotton, comfortable fit, perfect for custom designs.",
  },
  {
    id: "women-tshirt",
    name: "Women's T-Shirt",
    price: 28,
    category: "T-Shirts",
    modelId: "women-tshirt",
    colors: ["#ffffff", "#000000", "#f43f5e", "#8b5cf6", "#06b6d4"],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/models/women-tshirt/main.jpg",
    description:
      "Stylish women's t-shirt. Soft cotton blend, flattering fit, ideal for personalization.",
  },
  {
    id: "baseball-cap",
    name: "Baseball Cap",
    price: 24,
    category: "Accessories",
    modelId: "baseball-cap",
    colors: ["#ffffff", "#000000", "#1f2937", "#FF6A00", "#6366F1"],
    sizes: ["One Size"],
    image: "/models/baseball-cap/main.jpg",
    description:
      "Classic baseball cap. Premium cotton twill, adjustable strap, perfect for custom embroidery.",
  },
  {
    id: "bag",
    name: "Tote Bag",
    price: 22,
    category: "Accessories",
    modelId: "bag",
    colors: ["#f5f0e8", "#000000", "#1f2937", "#6366F1", "#f43f5e"],
    sizes: ["One Size"],
    image: "/models/bag/main.jpg",
    description:
      "Canvas tote bag. Durable cotton canvas, spacious design, perfect for custom prints.",
  },
];

export const findProduct = (id) => products.find((p) => p.id === id);

