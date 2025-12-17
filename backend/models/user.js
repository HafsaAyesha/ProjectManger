const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    list: [
        {
            type: mongoose.Types.ObjectId,
            ref: "List",
        },
    ],
    profile: {
        title: { type: String, default: "" },
        bio: { type: String, default: "" },
        location: { type: String, default: "" },
        availability: { type: String, enum: ["Available", "Busy", "Not Available"], default: "Available" },
        phone: { type: String, default: "" },
        dob: { type: Date },
        languages: [{
            language: String,
            proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Native"] }
        }],
        hourlyRate: { type: Number, default: 0 },
        portfolio: { type: String, default: "" },
        socialLinks: {
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            website: { type: String, default: "" }
        },
        skills: [{
            name: String,
            level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] }
        }],
        education: [{
            degree: String,
            institution: String,
            year: String,
            field: String
        }],
        certifications: [{
            name: String,
            organization: String,
            date: Date,
            link: String
        }],
        experience: [{
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String
        }],
        avatar: { type: String, default: "" } // URL or Base64
    }
});

module.exports = mongoose.model("User", userSchema);