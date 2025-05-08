import { apiRequest } from './queryClient';

// Authentication
export const loginUser = async (username: string, password: string) => {
  const response = await apiRequest('POST', '/api/auth/login', { username, password });
  return response.json();
};

export const logoutUser = async () => {
  const response = await apiRequest('POST', '/api/auth/logout');
  return response.json();
};

export const checkAuth = async () => {
  const response = await apiRequest('GET', '/api/auth/check');
  return response.json();
};

// User management
export const registerUser = async (userData: any) => {
  const response = await apiRequest('POST', '/api/users', userData);
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await apiRequest('GET', '/api/users/current');
  return response.json();
};

// Categories
export const getCategories = async () => {
  const response = await apiRequest('GET', '/api/categories');
  return response.json();
};

export const getCategoryById = async (id: number) => {
  const response = await apiRequest('GET', `/api/categories/${id}`);
  return response.json();
};

// Products
export const getProducts = async () => {
  const response = await apiRequest('GET', '/api/products');
  return response.json();
};

export const getProductById = async (id: number) => {
  const response = await apiRequest('GET', `/api/products/${id}`);
  return response.json();
};

export const getProductsByCategory = async (categoryId: number) => {
  const response = await apiRequest('GET', `/api/categories/${categoryId}/products`);
  return response.json();
};

// Samples
export const getSamples = async () => {
  const response = await apiRequest('GET', '/api/samples');
  return response.json();
};

export const createSample = async (sampleData: any) => {
  const response = await apiRequest('POST', '/api/samples', sampleData);
  return response.json();
};

// Orders
export const getOrders = async () => {
  const response = await apiRequest('GET', '/api/orders');
  return response.json();
};

export const getOrderById = async (id: number) => {
  const response = await apiRequest('GET', `/api/orders/${id}`);
  return response.json();
};

export const createOrder = async (orderData: any) => {
  const response = await apiRequest('POST', '/api/orders', orderData);
  return response.json();
};

// Designs
export const getDesigns = async () => {
  const response = await apiRequest('GET', '/api/designs');
  return response.json();
};

export const createDesign = async (designData: any) => {
  const response = await apiRequest('POST', '/api/designs', designData);
  return response.json();
};

// Messages
export const getMessages = async () => {
  const response = await apiRequest('GET', '/api/messages');
  return response.json();
};

export const createMessage = async (messageData: any) => {
  const response = await apiRequest('POST', '/api/messages', messageData);
  return response.json();
};

export const markMessageAsRead = async (id: number) => {
  const response = await apiRequest('PUT', `/api/messages/${id}/read`);
  return response.json();
};

// Activities
export const getActivities = async () => {
  const response = await apiRequest('GET', '/api/activities');
  return response.json();
};
