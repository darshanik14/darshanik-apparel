import { Product, Category, Sample, Order, Design } from "@shared/schema";

// Mapping of product IDs to image URLs from Unsplash
const productImageMap: Record<number, string> = {
  1: "photo-1618354691373-d851c5c3a990", // Premium Cotton T-Shirt
  2: "photo-1624378439575-d8705ad7ae80", // Eco Denim Fabric
  3: "photo-1614676471928-2ebd94e2e2d4", // Fleece Pullover Hoodie
  4: "photo-1620799140408-edc6dcb6d633", // Organic Cotton
  5: "photo-1587142631018-b2d8dcce3bc3", // Linen Blend
  6: "photo-1596462502278-27bfdc403348", // Recycled Polyester
};

// Mapping of category IDs to image URLs from Unsplash
const categoryImageMap: Record<number, string> = {
  1: "photo-1556740738-b6a63e27c4df", // T-Shirts
  2: "photo-1581655353564-df123a1eb820", // Hoodies
  3: "photo-1536992266094-82847e1fd431", // Fabrics
  4: "photo-1542042457485-47193333a3e5", // Accessories
};

/**
 * Get an appropriate image URL for a product
 */
export function getProductImage(product: Product): string {
  const imageKey = productImageMap[product.id] || "photo-1618354691373-d851c5c3a990";
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`;
}

/**
 * Get an appropriate image URL for a category
 */
export function getCategoryImage(category: Category): string {
  const imageKey = categoryImageMap[category.id] || "photo-1556740738-b6a63e27c4df";
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
}

/**
 * Get an image for textile manufacturing (for hero sections, backgrounds)
 */
export function getTextileManufacturingImage(index: number = 1): string {
  const textileManufacturingImages = [
    "photo-1567922045116-2a00fae2ed03", // Textile factory
    "photo-1586773248828-9fbdb56e4406", // Textile machinery
    "photo-1583101767903-5f5f8312edac", // Textile production
    "photo-1464146072230-91cabc968266", // Textile patterns
  ];
  
  const imageKey = textileManufacturingImages[(index - 1) % textileManufacturingImages.length];
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80`;
}

/**
 * Get an image for fabric samples
 */
export function getFabricSampleImage(index: number = 1): string {
  const fabricSampleImages = [
    "photo-1620799139507-2a76f79a2f4d", // Fabric swatches
    "photo-1620799139834-30a9a9c6b104", // Colorful fabrics
    "photo-1548123378-bde4eca81d2d", // Fabric texture
    "photo-1605518215584-e2844968ae2d", // Fabric samples
  ];
  
  const imageKey = fabricSampleImages[(index - 1) % fabricSampleImages.length];
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
}

/**
 * Get an image for clothing production
 */
export function getClothingProductionImage(index: number = 1): string {
  const clothingProductionImages = [
    "photo-1473038800519-ffadcd154eb9", // Sewing machine
    "photo-1564859228273-274232fdb516", // Clothing factory
    "photo-1556229232-c3aa9c96f4a7", // Making clothes
    "photo-1581266299015-033398020e6a", // Production line
  ];
  
  const imageKey = clothingProductionImages[(index - 1) % clothingProductionImages.length];
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
}

/**
 * Get an image for textile warehouse
 */
export function getTextileWarehouseImage(index: number = 1): string {
  const textileWarehouseImages = [
    "photo-1584271854089-9bb3e5168e32", // Fabric rolls
    "photo-1494522358652-458a9a020958", // Warehouse shelves
  ];
  
  const imageKey = textileWarehouseImages[(index - 1) % textileWarehouseImages.length];
  return `https://images.unsplash.com/${imageKey}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
}

/**
 * Get a user profile image (placeholder)
 */
export function getUserProfileImage(): string {
  return "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80";
}

/**
 * Get a company logo image (placeholder)
 */
export function getCompanyLogoImage(): string {
  return "https://images.unsplash.com/photo-1560243563-062bfc001d68?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80";
}
