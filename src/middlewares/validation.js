import * as z from "zod";

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    nationalIdNUmber: z.string().optional(),
    nationalIdImage: z.string().optional(),
    role: z.enum(["Particulier", "Admin"]).default("Particulier"),
    isKYCVirified: z.boolean().default(false),
    groups: z.array(z.string()).optional(),
    paymentHistory: z.array(z.string()).optional(),
    notifications: z.array(z.string()).optional(),
    messages: z.array(z.string()).optional(),
    facialVerificationStatus: z.enum(["pending", "verified", "failed"]).default("pending")
});

export const validateUserRegistration = (userInput) => {
    return userSchema.safeParse(userInput);
};

export const validateUserUpdate = (userInput) => {
    return userSchema.partial().safeParse(userInput);
};