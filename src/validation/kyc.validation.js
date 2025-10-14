import { z } from 'zod';

export const kycSubmissionSchema = z.object({
    nationalIdNumber: z.string()
});

export const kycReviewSchema = z.object({
    status: z.enum(['approved', 'rejected', 'under_review']),
    rejectionReason: z.string().optional(),
    verificationNotes: z.string().optional(),
});