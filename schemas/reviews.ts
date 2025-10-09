import { z } from "zod";

export const ReviewSchema = z.object({
    review: z
        .string()
        .min(5, "Review must be at least 5 characters long")
        .max(1000, "Review must be under 1000 characters"),

    rating: z
        .number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating cannot exceed 5" })
        .refine((val) => Number.isInteger(val), {
            message: "Rating must be an integer between 1-5",
        }),

    reviewerName: z
        .string()
        .min(1, { message: "Reviewer name is required" })
        .max(100, { message: "Reviewer name must be under 100 characters" })
        .optional()
});



export type Review = z.infer<typeof ReviewSchema>