import { z } from 'zod';

// Create Group Schema
export const createGroupSchema = z.object({
    groupName: z.string()
        .min(1, "Group name is required")
        .max(100, "Group name must be less than 100 characters"),
    
    amountPerCycle: z.number()
        .positive("Amount per cycle must be positive")
        .or(z.string().transform(val => {
            const num = Number(val);
            if (isNaN(num)) throw new Error("Amount must be a valid number");
            return num;
        })),
    
    totalCycle: z.number()
        .int("Total cycle must be an integer")
        .positive("Total cycle must be positive")
        .or(z.string().transform(val => {
            const num = Number(val);
            if (isNaN(num) || !Number.isInteger(num)) throw new Error("Total cycle must be a valid integer");
            return num;
        })),
    
    members: z.array(z.string()).optional().default([]),
    
    paymentSchedule: z.array(z.string().or(z.date()))
        .optional()
        .default([]),
    
    potDistributionOrder: z.array(z.string())
        .optional()
        .default([]),
    
    nextPayoutUser: z.string().optional(),
    
    isActive: z.boolean().optional().default(true),
    
    status: z.enum(['waiting', 'active', 'completed', 'cancelled'])
        .optional()
        .default('waiting')
});

// Update Group Schema
export const updateGroupSchema = z.object({
    groupName: z.string()
        .min(1, "Group name is required")
        .max(100, "Group name must be less than 100 characters")
        .optional(),
    
    amountPerCycle: z.number()
        .positive("Amount per cycle must be positive")
        .optional(),
    
    totalCycle: z.number()
        .int("Total cycle must be an integer")
        .positive("Total cycle must be positive")
        .optional(),
    
    isActive: z.boolean().optional(),
    
    status: z.enum(['waiting', 'active', 'completed', 'cancelled']).optional()
});

// Add Member Schema
export const addMemberSchema = z.object({
    userEmail: z.string()
        .email("Invalid email format")
        .min(1, "User email is required")
});

// Remove Member Schema
export const removeMemberSchema = z.object({
    userId: z.string()
        .min(1, "User ID is required")
});

// Validation functions
export const validateCreateGroup = (data) => {
    return createGroupSchema.safeParse(data);
};

export const validateUpdateGroup = (data) => {
    return updateGroupSchema.safeParse(data);
};

export const validateAddMember = (data) => {
    return addMemberSchema.safeParse(data);
};

export const validateRemoveMember = (data) => {
    return removeMemberSchema.safeParse(data);
};