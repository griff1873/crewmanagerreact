import { z } from 'zod';

export const BoatSchema = z.object({
  id: z.number().int('ID must be an integer'),
  name: z.string()
    .min(1, 'Boat name is required')
    .max(200, 'Boat name must be 200 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .default(''),
  image: z.string()
    .default('/images/defaultboat.png'),
  profileId: z.coerce.number().int('Profile ID must be an integer').min(1, 'Profile ID is required'),
  // Audit fields
  // Audit fields
  createdAt: z.string().datetime('Created date must be a valid datetime').optional(),
  updatedAt: z.string().datetime('Updated date must be a valid datetime').optional(),
  isDeleted: z.boolean().default(false),
  deletedBy: z.string().nullable().optional(),
  deletedAt: z.string().datetime().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional()
});

// Pagination schema (reuse from existing schemas)
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalCount: z.number().int().min(0),
  totalPages: z.number().int().min(0)
});

// Full API response schema for boats list
export const BoatsResponseSchema = z.object({
  boats: z.array(BoatSchema),
  pagination: PaginationSchema
});

// Schema for creating a new boat (without audit fields)
export const CreateBoatSchema = BoatSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
  deletedBy: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true
});

// Schema for updating a boat (only user-editable fields)
export const UpdateBoatSchema = z.object({
  id: z.number().int(),
  name: z.string()
    .min(1, 'Boat name is required')
    .max(200, 'Boat name must be 200 characters or less')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  profileId: z.number().int('Profile ID must be an integer').min(1, 'Profile ID is required').optional()
});

// Schema for boat public view (without sensitive audit info)
export const PublicBoatSchema = BoatSchema.omit({
  isDeleted: true,
  deletedBy: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true
});

// Schema for boat form input (without id and audit fields)
export const BoatFormSchema = z.object({
  name: z.string()
    .min(1, 'Boat name is required')
    .max(200, 'Boat name must be 200 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .default(''),
  profileId: z.number().int('Profile ID must be an integer').min(1, 'Profile ID is required')
});