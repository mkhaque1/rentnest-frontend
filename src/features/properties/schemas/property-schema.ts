import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  price: z.number().positive('Price must be greater than 0'),
  bedrooms: z.number({ error: 'Enter number of bedrooms' }).int().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.number({ error: 'Enter number of bathrooms' }).int().min(0, 'Bathrooms must be 0 or more'),
  categoryId: z.string().min(1, 'Select a category'),
  amenities: z.string().optional(),
  images: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
