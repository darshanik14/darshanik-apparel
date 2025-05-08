import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for business clients
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  kycVerified: boolean("kyc_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  kycVerified: true,
});

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  moq: integer("moq").notNull(), // Minimum Order Quantity
  priceMin: doublePrecision("price_min").notNull(),
  priceMax: doublePrecision("price_max").notNull(),
  unit: text("unit").notNull(), // e.g., pieces, meters
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  tags: text("tags").array(),
  specs: jsonb("specs"), // JSON for product specifications
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

// Fabric samples
export const samples = pgTable("samples", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  status: text("status").notNull().default("pending"), // pending, approved, shipped, delivered
  shippingAddress: text("shipping_address").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  specialInstructions: text("special_instructions"),
  sampleFee: doublePrecision("sample_fee"),
  shippingFee: doublePrecision("shipping_fee"),
  tax: doublePrecision("tax"),
  totalFee: doublePrecision("total_fee"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSampleSchema = createInsertSchema(samples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // Format: DAS-YYYY-XXXX
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  sizeBreakdown: jsonb("size_breakdown"), // JSON for size distribution
  colors: jsonb("colors"), // JSON for color choices
  customization: jsonb("customization"), // JSON for any customization details
  deliveryDate: date("delivery_date"),
  status: text("status").notNull().default("pending"), // pending, confirmed, in_production, shipped, delivered
  statusTimeline: jsonb("status_timeline"), // JSON for tracking status changes with timestamps
  totalAmount: doublePrecision("total_amount").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  customizationFee: doublePrecision("customization_fee"),
  shippingFee: doublePrecision("shipping_fee"),
  tax: doublePrecision("tax"),
  shippingAddress: text("shipping_address").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  notes: text("notes"),
  progressPercentage: integer("progress_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
  progressPercentage: true,
});

// Design uploads
export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // Logo, Full Print, Pattern, Embroidery
  orderId: integer("order_id").references(() => orders.id), // Optional association with an order
  fileUrls: text("file_urls").array(), // Array of file URLs
  notes: text("notes"),
  status: text("status").notNull().default("submitted"), // submitted, reviewed, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDesignSchema = createInsertSchema(designs).omit({
  id: true,
  createdAt: true,
});

// Messages/Communications
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  orderId: integer("order_id").references(() => orders.id), // Optional association with an order
  sampleId: integer("sample_id").references(() => samples.id), // Optional association with a sample
  designId: integer("design_id").references(() => designs.id), // Optional association with a design
  content: text("content").notNull(),
  isFromUser: boolean("is_from_user").notNull(), // true if from user, false if from Darshanik
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  read: true,
});

// Activities for the activity feed
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // sample_request, payment, design_review, order_status_change, etc.
  relatedId: integer("related_id"), // ID of the related entity (order, sample, etc.)
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Sample = typeof samples.$inferSelect;
export type InsertSample = z.infer<typeof insertSampleSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Design = typeof designs.$inferSelect;
export type InsertDesign = z.infer<typeof insertDesignSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;