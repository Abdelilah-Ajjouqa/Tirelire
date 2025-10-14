import { z } from 'zod';

export const kycSubmissionSchema = z.object({
    nationalIdNumber: z.string()
        .min(5, 'National ID must be at leat 5 characters')
        .max(20, 'National ID must not exceed 20 characters')
});

export const kycReviewSchema = z.object({
    status: z.enum(['approved', 'rejected', 'under_review']),
    rejectionReason: z.string().optional(),
    verificationNotes: z.string().optional(),
});