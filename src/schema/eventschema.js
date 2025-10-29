import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number().int('ID must be an integer'),
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().datetime('Start date must be a valid datetime'),
  endDate: z.string().datetime('End date must be a valid datetime'),
  location: z.string()
    .min(1, 'Location is required')
    .max(300, 'Location must be 300 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .default(''),
  minCrew: z.number()
    .int('Min crew must be an integer')
    .min(0, 'Min crew cannot be negative'),
  maxCrew: z.number()
    .int('Max crew must be an integer')
    .min(0, 'Max crew cannot be negative'),
  desiredCrew: z.number()
    .int('Desired crew must be an integer')
    .min(0, 'Desired crew cannot be negative'),
  // Audit fields
  createdAt: z.string().datetime('Created date must be a valid datetime'),
  updatedAt: z.string().datetime('Updated date must be a valid datetime'),
  isDeleted: z.boolean(),
  deletedBy: z.string().nullable(),
  deletedAt: z.string().datetime().nullable(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable()
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
}).refine((data) => data.minCrew <= data.maxCrew, {
  message: "Min crew cannot be greater than max crew",
  path: ["maxCrew"]
}).refine((data) => data.desiredCrew >= data.minCrew && data.desiredCrew <= data.maxCrew, {
  message: "Desired crew must be between min and max crew",
  path: ["desiredCrew"]
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalCount: z.number().int().min(0),
  totalPages: z.number().int().min(0)
});

// Full API response schema
export const EventsResponseSchema = z.object({
  events: z.array(EventSchema),
  pagination: PaginationSchema
});

// Schema for creating a new event (without audit fields)
export const CreateEventSchema = EventSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  isDeleted: true, 
  deletedBy: true, 
  deletedAt: true, 
  createdBy: true, 
  updatedBy: true 
});

// Schema for updating an event (only user-editable fields)
export const UpdateEventSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, 'Name is required').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().max(300).optional(),
  description: z.string().max(1000).optional(),
  minCrew: z.number().int().min(0).optional(),
  maxCrew: z.number().int().min(0).optional(),
  desiredCrew: z.number().int().min(0).optional()
});