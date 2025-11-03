import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DONOR', 'NGO', 'ADMIN']),
  ngo: z
    .object({
      name: z.string().min(2, 'NGO name must be at least 2 characters'),
      description: z.string().optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Request schemas
export const createRequestSchema = z.object({
  itemName: z.string().min(2, 'Item name must be at least 2 characters'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
});

export const updateRequestSchema = z.object({
  itemName: z.string().min(2).optional(),
  quantity: z.number().int().positive().optional(),
  unit: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'FULFILLED', 'ARCHIVED']).optional(),
});

// Donation schemas
export const createDonationSchema = z.object({
  ngoId: z.string().cuid('Invalid NGO ID'),
  requestId: z.string().cuid('Invalid request ID').optional(),
  donationType: z.string().min(2, 'Donation type is required'),
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const updateDonationSchema = z.object({
  status: z.enum(['PENDING', 'RECEIVED', 'VERIFIED', 'CANCELED']),
});

// Admin schemas
export const verifyNGOSchema = z.object({
  ngoId: z.string().cuid('Invalid NGO ID'),
  verified: z.boolean(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;
export type VerifyNGOInput = z.infer<typeof verifyNGOSchema>;
