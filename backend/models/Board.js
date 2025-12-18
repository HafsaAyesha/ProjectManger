const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        columns: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Column",
            },
        ],
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
