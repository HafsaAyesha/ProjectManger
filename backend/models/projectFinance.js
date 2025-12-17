const mongoose = require("mongoose");

const projectFinanceSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true, // One finance record per project
    },
    totalBudget: {
        type: Number,
        default: 0,
    },
    paymentsReceived: [{
        amount: Number,
        date: { type: Date, default: Date.now },
        description: String,
    }],
    expenses: [{
        amount: Number,
        date: { type: Date, default: Date.now },
        description: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model("ProjectFinance", projectFinanceSchema);
