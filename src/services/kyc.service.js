import KYCVerification from '../models/KYCVerification.model.js';
import User from '../models/User.js';

export const submitKYC = async (userId, kycData) => {
    try {
        const existingKYC = await KYCVerification.findOne({
            user: userId,
            status: { $in: ['pending', 'under_review'] }
        });

        if (existingKYC) {
            throw new Error('You already have a KYC verification in progress');
        }

        const kycVerification = new KYCVerification({
            user: userId,
            ...kycData
        });

        await kycVerification.save();

        // Update user's KYC status
        await User.findByIdAndUpdate(userId, {
            nationalIdNumber: kycData.nationalIdNumber,
            nationalIdImage: kycData.nationalIdImage,
            isKYCVerified: false
        });

        return kycVerification;
    } catch (error) {
        throw error;
    }
};

export const getUserKYC = async (userId) => {
    try {
        const kycVerification = await KYCVerification
            .findOne({ user: userId })
            .sort({ createdAt: -1 });

        return kycVerification;
    } catch (error) {
        throw error;
    }
};

export const getKYCById = async (kycId) => {
    try {
        const kycVerification = await KYCVerification.findById(kycId)
        return kycVerification;
    } catch (error) {
        throw error;
    }
};