import * as kycServices from "../services/kyc.service.js"
import { kycSubmissionSchema, kycReviewSchema } from "../validation/kyc.validation.js";

export const submitKYC = async (req, res) => {
    try {
        const bodyReq = req.body;
        const user = req.user._id
        const validateData = kycSubmissionSchema.parse(bodyReq);
        const file = req.file;
        const filePath = file ? file.path : undefined;

        const kycVerification = await kycServices.submitKYC(user, {
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