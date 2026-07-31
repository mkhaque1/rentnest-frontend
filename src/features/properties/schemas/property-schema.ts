import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  price: z.number().positive('Price must be greater than 0'),
  categoryId: z.string().min(1, 'Select a category'),
  amenities: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
