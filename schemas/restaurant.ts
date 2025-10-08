import { z } from "zod";

export const RestaurantSchema = z.object({
    name: z
        .string()
        .min(1, "Restaurant name is required")
        .max(100, "Restaurant name must be under 100 characters"),
    location: z
        .string()
        .min(1, "Location is required")
        .max(150, "Location must be under 150 characters"),
    cuisines: z
        .array(z.string().min(1, "Cuisine cannot be empty"))
        .nonempty("At least one cuisine is required"),
});

export const RestaurantDetailsSchema = z.object({
    links: z
        .array(
            z.object({
                name: z
                    .string()
                    .min(1, "Link name is required")
                    .max(50, "Link name must be under 50 characters"),
                url: z
                    .url("Invalid URL format")
                    .max(200, "URL must be under 200 characters"),
            })
        )
        .optional()
        .default([]),

    contact: z.object({
        phone: z
            .string()
            .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number format"),
        email: z.email("Invalid email format"),
    }),

    address: z.object({
        address1: z
            .string()
            .min(1, "Address line 1 is required")
            .max(150, "Address line 1 must be under 150 characters"),
        address2: z
            .string()
            .max(150, "Address line 2 must be under 150 characters")
            .optional()
            .or(z.literal("")),
        city: z
            .string()
            .min(1, "City is required")
            .max(100, "City must be under 100 characters"),
        state: z
            .string()
            .min(1, "State is required")
            .max(100, "State must be under 100 characters"),
        country: z
            .string()
            .min(1, "Country is required")
            .max(100, "Country must be under 100 characters"),
        pin: z
            .string()
            .regex(/^\d{4,10}$/, "PIN must be between 4 and 10 digits"),
    }),
});

export type Restaurant = z.infer<typeof RestaurantSchema>
export type RestaurantDetails = z.infer<typeof RestaurantDetailsSchema>