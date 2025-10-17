import * as kycServices from "../services/kyc.service.js"
import { kycSubmissionSchema, kycReviewSchema } from "../validation/kyc.validation.js";

export const submitKYC = async (req, res) => {
    try {
        const bodyReq = req.body;
        const userId = req.user._id
        const validateData = kycSubmissionSchema.parse(bodyReq);
        const file = req.file;
        const filePath = file ? file.path : undefined;

        const kycVerification = await kycServices.submitKYC(userId, {
            ...validateData,
            nationalIdImage: filePath
        });

        res.status(201).json({
            message: 'KYC verification has been submitted',
            data: kycVerification
        });
    } catch (error) {
        return res.status(401).json({
            message: "error",
            error: error.message
        });
    }
}

export const getUserKYC = async (req, res) => {
    try {
        const userId = req.user._id;
        const kycVerification = await kycServices.getUserKYC(userId);
        if (!kycVerification) {
            return res.status(404).json({
                message: 'No KYC found'
            });
        }
        return res.status(200).json({
            data: kycVerification
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error',
            error: error.message
        })
    }
}