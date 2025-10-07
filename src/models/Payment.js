import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    cycleNumber: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Payment = new mongoose.model('Payment', paymentSchema);

export default Payment;