const mongoose = require('mongoose');

const projectTechLinkSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    platform: {
        type: String, // e.g., 'GitHub', 'Vercel', 'Netlify', 'Other'
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProjectTechLink', projectTechLinkSchema);
