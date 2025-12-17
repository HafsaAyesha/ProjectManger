const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'on-hold', 'completed'],
            default: 'active',
        },
        budget: {
            type: Number,
            min: 0,
        },
        deadline: {
            type: Date,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        netProfit: {
            type: Number,
            default: 0,
            min: 0,
        },
        tags: {
            type: [String],
            default: [],
        },
        notesCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Project", projectSchema);
