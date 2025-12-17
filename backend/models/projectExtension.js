const mongoose = require("mongoose");

const projectExtensionSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true, // One extension record per project
    },
    requirements: {
        type: String,
        default: "",
    },
    scope: {
        type: String,
        default: "",
    },
    deliverables: [{
        text: String,
        isCompleted: { type: Boolean, default: false }
    }],
    clientInfo: {
        email: String,
        notes: String,
        communicationLog: [{
            date: { type: Date, default: Date.now },
            summary: String,
            type: { type: String, enum: ['email', 'call', 'meeting', 'other'], default: 'other' }
        }]
    }
}, { timestamps: true });

module.exports = mongoose.model("ProjectExtension", projectExtensionSchema);
