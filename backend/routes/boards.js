const router = require("express").Router();
const Board = require("../models/Board");
const Column = require("../models/Column");
const User = require("../models/user");

// GET all boards for a user
router.get("/boards/:userId", async (req, res) => {
    try {
        const boards = await Board.find({
            userId: req.params.userId,
            isArchived: false,
        }).sort({ createdAt: -1 });

        res.status(200).json({ boards });
    } catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ message: "Failed to fetch boards" });
    }
});

// GET single board with populated columns and cards
router.get("/boards/detail/:boardId", async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId)
            .populate({
                path: "columns",
                options: { sort: { order: 1 } },
                populate: {
                    path: "cards",
                    options: { sort: { order: 1 } },
                    populate: [
                        { path: "assignee", select: "username email" },
                        { path: "createdBy", select: "username email" },
                    ],
                },
            })
            .populate("userId", "username email");

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json({ board });
    } catch (error) {
        console.error("Error fetching board details:", error);
        res.status(500).json({ message: "Failed to fetch board details" });
    }
});

// CREATE new board with default columns
router.post("/boards", async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        if (!title || !userId) {
            return res.status(400).json({ message: "Title and userId are required" });
        }

        // Create the board
        const board = new Board({
            title,
            description,
            userId,
        });

        await board.save();

        // Create default columns
        const defaultColumns = [
            { title: "To Do", order: 0, color: "#6b7280" },
            { title: "In Progress", order: 1, color: "#3b82f6" },
            { title: "Review", order: 2, color: "#8b5cf6" },
            { title: "Done", order: 3, color: "#10b981" },
        ];

        const columnPromises = defaultColumns.map((col) => {
            const column = new Column({
                title: col.title,
                boardId: board._id,
                order: col.order,
                color: col.color,
            });
            return column.save();
        });

        const columns = await Promise.all(columnPromises);

        // Add column IDs to board
        board.columns = columns.map((col) => col._id);
        await board.save();

        // Populate and return the board
        const populatedBoard = await Board.findById(board._id).populate("columns");

        res.status(201).json({ board: populatedBoard });
    } catch (error) {
        console.error("Error creating board:", error);
        res.status(500).json({ message: "Failed to create board" });
    }
});

// UPDATE board
router.put("/boards/:boardId", async (req, res) => {
    try {
        const { title, description } = req.body;

        const board = await Board.findByIdAndUpdate(
            req.params.boardId,
            { title, description },
            { new: true }
        );

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json({ board });
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).json({ message: "Failed to update board" });
    }
});

// DELETE (archive) board
router.delete("/boards/:boardId", async (req, res) => {
    try {
        const board = await Board.findByIdAndUpdate(
            req.params.boardId,
            { isArchived: true },
            { new: true }
        );

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json({ message: "Board archived successfully" });
    } catch (error) {
        console.error("Error archiving board:", error);
        res.status(500).json({ message: "Failed to archive board" });
    }
});

module.exports = router;
