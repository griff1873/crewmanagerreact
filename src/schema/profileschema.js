import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.number().int('ID must be an integer'),
  loginId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email address'),
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
  // Audit fields
  createdAt: z.string().datetime('Created date must be a valid datetime'),
  updatedAt: z.string().datetime('Updated date must be a valid datetime'),
  isDeleted: z.boolean(),
  deletedBy: z.string().nullable(),
  deletedAt: z.string().datetime().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable()
});

// Pagination schema (imported from eventschema for consistency)
export { PaginationSchema } from './eventschema';

// Full API response schema for profiles list
export const ProfilesResponseSchema = z.object({
  profiles: z.array(ProfileSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    totalCount: z.number().int().min(0),
    totalPages: z.number().int().min(0)
  })
});

// Schema for creating a new profile (without audit fields)
export const CreateProfileSchema = ProfileSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  isDeleted: true, 
  deletedBy: true, 
  deletedAt: true, 
  createdBy: true, 
  updatedBy: true 
});

// Schema for updating a profile (only user-editable fields)
export const UpdateProfileSchema = z.object({
  id: z.number().int(),
  loginId: z.string().optional(),
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Must be a valid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

// Schema for profile registration/creation (without id and audit fields)
export const RegisterProfileSchema = z.object({
  loginId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email address'),
  phone: z.string().optional().default(''),
  address: z.string().optional().default('')
});

// Schema for profile public view (without sensitive audit info)
export const PublicProfileSchema = ProfileSchema.omit({
  isDeleted: true,
  deletedBy: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true
});