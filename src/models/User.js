import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nationalIdNUmber: { type: String, required: true },
    nationalIdImage: { type: String, required: true },
    role: { type: String, enum: ["Particulier", "Admin"], default: "Particulier", required: true },
    isKYCVirified: { type: Boolean, default: false },
    groups: [{ type: mongoose.Schema.ObjectId, ref: 'Group' }],
    paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    facialVerificationStatus: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;