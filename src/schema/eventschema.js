import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().datetime('Start date must be a valid datetime'),
  endDate: z.string().datetime('End date must be a valid datetime'),
  location: z.string()
    .min(1, 'Location is required')
    .max(300, 'Location must be 300 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .default(''),
  minCrew: z.number()
    .int('Min crew must be an integer')
    .min(0, 'Min crew cannot be negative'),
  maxCrew: z.number()
    .int('Max crew must be an integer')
    .min(0, 'Max crew cannot be negative'),
  desiredCrew: z.number()
    .int('Desired crew must be an integer')
    .min(0, 'Desired crew cannot be negative')
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

// Schema for creating a new event (without id)
export const CreateEventSchema = EventSchema.omit({ id: true });

// Schema for updating an event (all fields optional except id)
export const UpdateEventSchema = EventSchema.partial().required({ id: true });