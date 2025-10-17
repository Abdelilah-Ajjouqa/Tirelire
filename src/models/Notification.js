import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    type: {
        type: String,
        enum: ['paymentReminder', 'cycleStart', 'cycleEnd', 'message', 'info', 'alert'],
        required: true
    },
    message: { type: String, required: true },
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    isSent: { type: Boolean, default: false },
    link: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;