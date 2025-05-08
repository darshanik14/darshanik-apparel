import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  samples, type Sample, type InsertSample,
  orders, type Order, type InsertOrder,
  designs, type Design, type InsertDesign,
  messages, type Message, type InsertMessage,
  activities, type Activity, type InsertActivity
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Storage interface for all data models
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Sample methods
  getSamples(): Promise<Sample[]>;
  getSample(id: number): Promise<Sample | undefined>;
  getUserSamples(userId: number): Promise<Sample[]>;
  createSample(sample: InsertSample): Promise<Sample>;
  updateSampleStatus(id: number, status: string): Promise<Sample | undefined>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, progressPercentage?: number): Promise<Order | undefined>;
  
  // Design methods
  getDesigns(): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
  getUserDesigns(userId: number): Promise<Design[]>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesignStatus(id: number, status: string): Promise<Design | undefined>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  getUserMessages(userId: number): Promise<Message[]>;
  getOrderMessages(orderId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Activity methods
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  getUserActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private samples: Map<number, Sample>;
  private orders: Map<number, Order>;
  private designs: Map<number, Design>;
  private messages: Map<number, Message>;
  private activities: Map<number, Activity>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private sampleId: number;
  private orderId: number;
  private designId: number;
  private messageId: number;
  private activityId: number;
  private orderCount: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.samples = new Map();
    this.orders = new Map();
    this.designs = new Map();
    this.messages = new Map();
    this.activities = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.sampleId = 1;
    this.orderId = 1;
    this.designId = 1;
    this.messageId = 1;
    this.activityId = 1;
    this.orderCount = 5600;
    
    // Initialize sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample categories
    this.createCategory({ name: "T-Shirts", description: "Various t-shirt styles", image: "/t-shirts.jpg" });
    this.createCategory({ name: "Hoodies", description: "Hoodie styles", image: "/hoodies.jpg" });
    this.createCategory({ name: "Fabrics", description: "Raw fabric materials", image: "/fabrics.jpg" });
    this.createCategory({ name: "Accessories", description: "Clothing accessories", image: "/accessories.jpg" });
    
    // Add sample products
    this.createProduct({
      name: "Premium Cotton T-Shirt",
      description: "180 GSM • 100% Organic",
      categoryId: 1,
      moq: 100,
      priceMin: 3.50,
      priceMax: 4.20,
      unit: "pieces",
      imageUrl: "/products/tshirt.jpg",
      tags: ["organic", "cotton", "premium"],
      specs: { gsm: 180, material: "100% Organic Cotton" }
    });
    
    this.createProduct({
      name: "Eco Denim Fabric",
      description: "12oz • Sustainable Process",
      categoryId: 3,
      moq: 50,
      priceMin: 5.80,
      priceMax: 6.50,
      unit: "meters",
      imageUrl: "/products/denim.jpg",
      tags: ["eco", "denim", "sustainable"],
      specs: { weight: "12oz", material: "Sustainable Denim" }
    });
    
    this.createProduct({
      name: "Fleece Pullover Hoodie",
      description: "320 GSM • Brushed Interior",
      categoryId: 2,
      moq: 50,
      priceMin: 8.20,
      priceMax: 9.50,
      unit: "pieces",
      imageUrl: "/products/hoodie.jpg",
      tags: ["fleece", "pullover", "hoodie"],
      specs: { gsm: 320, material: "Brushed Fleece" }
    });
    
    this.createProduct({
      name: "Organic Cotton",
      description: "Premium • $5.20/m",
      categoryId: 3,
      moq: 10,
      priceMin: 5.00,
      priceMax: 5.50,
      unit: "meters",
      imageUrl: "/fabrics/cotton.jpg",
      tags: ["organic", "cotton", "fabric"],
      specs: { gsm: 180, material: "100% Organic Cotton" }
    });
    
    this.createProduct({
      name: "Linen Blend",
      description: "Eco-friendly • $8.40/m",
      categoryId: 3,
      moq: 10,
      priceMin: 8.20,
      priceMax: 8.60,
      unit: "meters",
      imageUrl: "/fabrics/linen.jpg",
      tags: ["linen", "blend", "eco-friendly"],
      specs: { gsm: 220, material: "Linen Blend" }
    });
    
    this.createProduct({
      name: "Recycled Polyester",
      description: "Sustainable • $3.75/m",
      categoryId: 3,
      moq: 10,
      priceMin: 3.50,
      priceMax: 4.00,
      unit: "meters",
      imageUrl: "/fabrics/polyester.jpg",
      tags: ["recycled", "polyester", "sustainable"],
      specs: { gsm: 120, material: "Recycled Polyester" }
    });
    
    // Add a sample user
    this.createUser({
      username: "fashionista",
      password: "password123",
      businessName: "Fashionista Exports",
      email: "info@fashionista.com",
      phone: "+1 (555) 123-4567",
      address: "123 Fashion Avenue, Suite 405, New York, NY 10001, United States"
    });
    
    // Create sample orders
    const sampleOrder1: InsertOrder = {
      userId: 1,
      productId: 1,
      quantity: 500,
      sizeBreakdown: { S: 100, M: 150, L: 150, XL: 75, XXL: 25 },
      colors: { Black: 250, White: 250 },
      customization: { printType: "Custom Logo", printLocation: "Front" },
      deliveryDate: new Date("2023-11-15"),
      status: "in_production",
      statusTimeline: {
        confirmed: "2023-10-05T10:30:00Z",
        payment_received: "2023-10-06T14:15:00Z",
        production_started: "2023-10-08T09:00:00Z",
        in_production: "2023-10-10T11:00:00Z"
      },
      totalAmount: 2860.00,
      subtotal: 2000.00,
      customizationFee: 500.00,
      shippingFee: 100.00,
      tax: 260.00,
      shippingAddress: "123 Fashion Avenue, Suite 405, New York, NY 10001, United States",
      contactName: "John Smith",
      contactPhone: "+1 (555) 123-4567",
      notes: "Rush order for seasonal collection"
    };
    
    const sampleOrder2: InsertOrder = {
      userId: 1,
      productId: 3,
      quantity: 200,
      sizeBreakdown: { S: 40, M: 60, L: 60, XL: 30, XXL: 10 },
      colors: { Black: 100, Navy: 100 },
      customization: { printType: "Embroidery", printLocation: "Chest" },
      deliveryDate: new Date("2023-12-05"),
      status: "awaiting_approval",
      statusTimeline: {
        confirmed: "2023-10-10T09:45:00Z",
        awaiting_approval: "2023-10-11T15:30:00Z"
      },
      totalAmount: 2200.00,
      subtotal: 1800.00,
      customizationFee: 200.00,
      shippingFee: 100.00,
      tax: 100.00,
      shippingAddress: "123 Fashion Avenue, Suite 405, New York, NY 10001, United States",
      contactName: "John Smith",
      contactPhone: "+1 (555) 123-4567",
      notes: "Premium packaging required"
    };

    this.createOrder(sampleOrder1);
    this.createOrder(sampleOrder2);
    
    // Add some sample activities
    this.createActivity({
      userId: 1,
      type: "sample_request",
      relatedId: 1,
      title: "Sample Request Approved",
      description: "Your sample request for \"Premium Fleece\" has been approved"
    });
    
    this.createActivity({
      userId: 1,
      type: "payment",
      relatedId: 1,
      title: "Payment Received",
      description: "Payment of $4,580 received for Order #DAS-2023-5520"
    });
    
    this.createActivity({
      userId: 1,
      type: "design_review",
      relatedId: 1,
      title: "Design Review Complete",
      description: "Your design for \"Summer Collection\" has been reviewed"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      kycVerified: false, 
      createdAt,
      address: insertUser.address || null,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      image: insertCategory.image || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      isActive: true, 
      createdAt,
      description: insertProduct.description || null,
      imageUrl: insertProduct.imageUrl || null,
      tags: insertProduct.tags || null,
      specs: insertProduct.specs || null
    };
    this.products.set(id, product);
    return product;
  }

  // Sample methods
  async getSamples(): Promise<Sample[]> {
    return Array.from(this.samples.values());
  }

  async getSample(id: number): Promise<Sample | undefined> {
    return this.samples.get(id);
  }

  async getUserSamples(userId: number): Promise<Sample[]> {
    return Array.from(this.samples.values()).filter(
      (sample) => sample.userId === userId,
    );
  }

  async createSample(insertSample: InsertSample): Promise<Sample> {
    const id = this.sampleId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const sample: Sample = { ...insertSample, id, createdAt, updatedAt };
    this.samples.set(id, sample);
    return sample;
  }

  async updateSampleStatus(id: number, status: string): Promise<Sample | undefined> {
    const sample = this.samples.get(id);
    if (!sample) return undefined;
    
    const updatedSample: Sample = { ...sample, status, updatedAt: new Date() };
    this.samples.set(id, updatedSample);
    return updatedSample;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber,
    );
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const orderCount = ++this.orderCount;
    const orderNumber = `DAS-${new Date().getFullYear()}-${orderCount}`;
    const createdAt = new Date();
    const updatedAt = new Date();
    const progressPercentage = 0;
    
    const order: Order = { 
      ...insertOrder, 
      id, 
      orderNumber, 
      createdAt, 
      updatedAt, 
      progressPercentage 
    };
    
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string, progressPercentage?: number): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      status, 
      updatedAt: new Date(),
      progressPercentage: progressPercentage !== undefined ? progressPercentage : order.progressPercentage
    };
    
    if (order.statusTimeline) {
      const timeline = { ...order.statusTimeline } as Record<string, string>;
      timeline[status] = new Date().toISOString();
      updatedOrder.statusTimeline = timeline;
    } else {
      updatedOrder.statusTimeline = { [status]: new Date().toISOString() };
    }
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Design methods
  async getDesigns(): Promise<Design[]> {
    return Array.from(this.designs.values());
  }

  async getDesign(id: number): Promise<Design | undefined> {
    return this.designs.get(id);
  }

  async getUserDesigns(userId: number): Promise<Design[]> {
    return Array.from(this.designs.values()).filter(
      (design) => design.userId === userId,
    );
  }

  async createDesign(insertDesign: InsertDesign): Promise<Design> {
    const id = this.designId++;
    const createdAt = new Date();
    const design: Design = { ...insertDesign, id, createdAt };
    this.designs.set(id, design);
    return design;
  }

  async updateDesignStatus(id: number, status: string): Promise<Design | undefined> {
    const design = this.designs.get(id);
    if (!design) return undefined;
    
    const updatedDesign: Design = { ...design, status };
    this.designs.set(id, updatedDesign);
    return updatedDesign;
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId,
    );
  }

  async getOrderMessages(orderId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.orderId === orderId,
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, read: false, createdAt };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: Message = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const createdAt = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt };
    this.activities.set(id, activity);
    return activity;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }
  
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }
  
  async getSamples(): Promise<Sample[]> {
    return db.select().from(samples);
  }
  
  async getSample(id: number): Promise<Sample | undefined> {
    const result = await db.select().from(samples).where(eq(samples.id, id));
    return result[0];
  }
  
  async getUserSamples(userId: number): Promise<Sample[]> {
    return db.select().from(samples).where(eq(samples.userId, userId));
  }
  
  async createSample(sample: InsertSample): Promise<Sample> {
    const result = await db.insert(samples).values(sample).returning();
    return result[0];
  }
  
  async updateSampleStatus(id: number, status: string): Promise<Sample | undefined> {
    const now = new Date();
    const result = await db
      .update(samples)
      .set({ status, updatedAt: now })
      .where(eq(samples.id, id))
      .returning();
    return result[0];
  }
  
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
  
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return result[0];
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const orderCount = await db.select().from(orders).then(orders => orders.length);
    const orderNumber = `DAS-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(4, '0')}`;
    
    const statusTimeline = [{
      status: "pending",
      timestamp: new Date().toISOString(),
      note: "Order received and awaiting confirmation"
    }];
    
    const result = await db
      .insert(orders)
      .values({
        ...order,
        orderNumber,
        status: "pending",
        statusTimeline,
        progressPercentage: 0
      })
      .returning();
      
    return result[0];
  }
  
  async updateOrderStatus(id: number, status: string, progressPercentage?: number): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const statusTimeline = Array.isArray(order.statusTimeline) ? order.statusTimeline : [];
    statusTimeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: `Order status updated to ${status}`
    });
    
    const now = new Date();
    const result = await db
      .update(orders)
      .set({
        status,
        statusTimeline,
        progressPercentage: progressPercentage !== undefined ? progressPercentage : order.progressPercentage,
        updatedAt: now
      })
      .where(eq(orders.id, id))
      .returning();
      
    return result[0];
  }
  
  async getDesigns(): Promise<Design[]> {
    return db.select().from(designs);
  }
  
  async getDesign(id: number): Promise<Design | undefined> {
    const result = await db.select().from(designs).where(eq(designs.id, id));
    return result[0];
  }
  
  async getUserDesigns(userId: number): Promise<Design[]> {
    return db.select().from(designs).where(eq(designs.userId, userId));
  }
  
  async createDesign(design: InsertDesign): Promise<Design> {
    const result = await db.insert(designs).values(design).returning();
    return result[0];
  }
  
  async updateDesignStatus(id: number, status: string): Promise<Design | undefined> {
    const result = await db
      .update(designs)
      .set({ status })
      .where(eq(designs.id, id))
      .returning();
      
    return result[0];
  }
  
  async getMessages(): Promise<Message[]> {
    return db.select().from(messages);
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }
  
  async getUserMessages(userId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.userId, userId));
  }
  
  async getOrderMessages(orderId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.orderId, orderId));
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const result = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
      
    return result[0];
  }
  
  async getActivities(): Promise<Activity[]> {
    return db.select().from(activities);
  }
  
  async getActivity(id: number): Promise<Activity | undefined> {
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0];
  }
  
  async getUserActivities(userId: number): Promise<Activity[]> {
    return db.select().from(activities).where(eq(activities.userId, userId));
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }
}

// Use database storage implementation
export const storage = new DatabaseStorage();
