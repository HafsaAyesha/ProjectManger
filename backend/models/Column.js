const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        wipLimit: {
            type: Number,
            default: null, // Work In Progress limit (null = no limit)
        },
        color: {
            type: String,
            default: "#667eea", // Default purple theme color
        },
        cards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Card",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Column", columnSchema);
