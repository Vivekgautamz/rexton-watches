import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(5, 'Street address is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().default('India'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Valid email is required'),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Cart cannot be empty'),
  shippingAddress: addressSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD']).default('RAZORPAY'),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  orderData: createOrderSchema,
});

export const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  sku: z.string().min(2, 'SKU is required'),
  shortDescription: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  movement: z.string().optional(),
  caseSize: z.string().optional(),
  caseMaterial: z.string().optional(),
  waterResistance: z.string().optional(),
  dialColor: z.string().optional(),
  strapMaterial: z.string().optional(),
  glassType: z.string().optional(),
  powerReserve: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  lowStockThreshold: z.number().int().default(3),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  categoryId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  images: z.array(
    z.object({
      url: z.string().url(),
      altText: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })
  ).min(1, 'At least one product image is required'),
});

export const reviewSchema = z.object({
  productId: z.string(),
  authorName: z.string().min(2, 'Name is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
});
