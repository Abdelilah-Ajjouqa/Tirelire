import mongoose from "mongoose";

const kycVerificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nationalIdNumber: { type: String, required: true },
    nationalIdImage: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'under_review'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
    verificationNotes: { type: String },
    submittedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Index for faster queries
kycVerificationSchema.index({ user: 1, status: 1 });
kycVerificationSchema.index({ status: 1 });

const KYCVerification = mongoose.model('KYCVerification', kycVerificationSchema);

export default KYCVerification;