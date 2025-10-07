import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    createdBy: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    amountPerCycle: { type: Number, required: true },
    totalCycle: { type: Number, required: true },
    currentCycle: { type: Number, default: 1 },
    paymentSchedule: [{ type: Date }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    potDistributionOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupFund: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    nextPayoutUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    status: { type: String, enum: ['waiting', 'active', 'completed', 'cancelled'], default: 'waiting' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;