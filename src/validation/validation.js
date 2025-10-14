import * as z from "zod";

// Base user schema for common fields
const userBaseSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should be at least 8 characters"),
});

// Extended user schema with all fields (for updates and full user objects)
const userExtendedSchema = userBaseSchema.extend({
    nationalIdNumber: z.string().optional(),
    nationalIdImage: z.string().optional(),
    role: z.enum(["Particulier", "Admin"]).default("Particulier"),
    isKYCVerified: z.boolean().default(false),
    groups: z.array(z.string()).optional(),
    paymentHistory: z.array(z.string()).optional(),
    notifications: z.array(z.string()).optional(),
    messages: z.array(z.string()).optional(),
    facialVerificationStatus: z.enum(["pending", "verified", "failed"]).default("pending")
});

// Login schema
export const userLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

// Registration schema
export const userRegistrationSchema = userBaseSchema;

// Update schema
export const userUpdateSchema = userExtendedSchema.partial();

// Full user schema
export const userFullSchema = userExtendedSchema;

// Validation functions
export const validateUserRegistration = (userInput) => {
    return userRegistrationSchema.safeParse(userInput);
};

export const validateUserLogin = (userInput) => {
    return userLoginSchema.safeParse(userInput);
};

export const validateUserUpdate = (userInput) => {
    return userUpdateSchema.safeParse(userInput);
};