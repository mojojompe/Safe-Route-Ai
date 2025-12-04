import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    startLocation: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    safetyScore: {
        type: Number,
        required: true,
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Route = mongoose.model('Route', routeSchema);
