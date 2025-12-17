const mongoose = require("mongoose");

const projectProgressSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true, // One progress record per project
    },
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    milestones: [{
        title: String,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending'
        },
        dueDate: Date,
    }],
    history: [{
        date: { type: Date, default: Date.now },
        update: String,
        percentage: Number,
    }]
}, { timestamps: true });

module.exports = mongoose.model("ProjectProgress", projectProgressSchema);
