const router = require("express").Router();
const Column = require("../models/Column");
const Board = require("../models/Board");
const Card = require("../models/Card");

// CREATE new column
router.post("/columns", async (req, res) => {
    try {
        const { title, boardId, color, wipLimit } = req.body;

        if (!title || !boardId) {
            return res.status(400).json({ message: "Title and boardId are required" });
        }

        // Get the board to find the next order number
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const order = board.columns.length;

        const column = new Column({
            title,
            boardId,
            order,
            color: color || "#667eea",
            wipLimit: wipLimit || null,
        });

        await column.save();

        // Add column to board
        board.columns.push(column._id);
        await board.save();

        res.status(201).json({ column });
    } catch (error) {
        console.error("Error creating column:", error);
        res.status(500).json({ message: "Failed to create column" });
    }
});

// UPDATE column
router.put("/columns/:columnId", async (req, res) => {
    try {
        const { title, color, wipLimit } = req.body;

        const column = await Column.findByIdAndUpdate(
            req.params.columnId,
            { title, color, wipLimit },
            { new: true }
        );

        if (!column) {
            return res.status(404).json({ message: "Column not found" });
        }

        res.status(200).json({ column });
    } catch (error) {
        console.error("Error updating column:", error);
        res.status(500).json({ message: "Failed to update column" });
    }
});

// DELETE column (and optionally move cards)
router.delete("/columns/:columnId", async (req, res) => {
    try {
        const { moveToColumnId } = req.body; // Optional: column to move cards to

        const column = await Column.findById(req.params.columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found" });
        }

        // If there are cards and a destination column is specified, move them
        if (column.cards.length > 0 && moveToColumnId) {
            const destinationColumn = await Column.findById(moveToColumnId);
            if (destinationColumn) {
                // Update all cards to new column
                await Card.updateMany(
                    { columnId: column._id },
                    { columnId: moveToColumnId }
                );

                // Add cards to destination column
                destinationColumn.cards.push(...column.cards);
                await destinationColumn.save();
            }
        } else if (column.cards.length > 0) {
            // Delete all cards in the column if no destination specified
            await Card.deleteMany({ columnId: column._id });
        }

        // Remove column from board
        await Board.findByIdAndUpdate(column.boardId, {
            $pull: { columns: column._id },
        });

        // Delete the column
        await Column.findByIdAndDelete(req.params.columnId);

        res.status(200).json({ message: "Column deleted successfully" });
    } catch (error) {
        console.error("Error deleting column:", error);
        res.status(500).json({ message: "Failed to delete column" });
    }
});

// REORDER columns
router.put("/columns/reorder", async (req, res) => {
    try {
        const { columnOrders } = req.body; // Array of { columnId, order }

        if (!Array.isArray(columnOrders)) {
            return res.status(400).json({ message: "columnOrders must be an array" });
        }

        // Update each column's order
        const updatePromises = columnOrders.map(({ columnId, order }) =>
            Column.findByIdAndUpdate(columnId, { order })
        );

        await Promise.all(updatePromises);

        res.status(200).json({ message: "Columns reordered successfully" });
    } catch (error) {
        console.error("Error reordering columns:", error);
        res.status(500).json({ message: "Failed to reorder columns" });
    }
});

module.exports = router;
