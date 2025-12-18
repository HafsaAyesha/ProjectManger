const router = require("express").Router();
const Card = require("../models/Card");
const Column = require("../models/Column");
const User = require("../models/user");

// CREATE new card
router.post("/cards", async (req, res) => {
    try {
        const {
            title,
            description,
            columnId,
            boardId,
            priority,
            dueDate,
            assignee,
            tags,
            createdBy,
        } = req.body;

        if (!title || !columnId || !boardId || !createdBy) {
            return res.status(400).json({
                message: "Title, columnId, boardId, and createdBy are required",
            });
        }

        // Get column to determine card order
        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found" });
        }

        const order = column.cards.length;

        const card = new Card({
            title,
            description,
            columnId,
            boardId,
            order,
            priority: priority || "medium",
            dueDate: dueDate || null,
            assignee: assignee || null,
            tags: tags || [],
            createdBy,
        });

        await card.save();

        // Add card to column
        column.cards.push(card._id);
        await column.save();

        // Populate and return
        const populatedCard = await Card.findById(card._id)
            .populate("assignee", "username email")
            .populate("createdBy", "username email");

        res.status(201).json({ card: populatedCard });
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ message: "Failed to create card" });
    }
});

// GET single card with full details
router.get("/cards/:cardId", async (req, res) => {
    try {
        const card = await Card.findById(req.params.cardId)
            .populate("assignee", "username email")
            .populate("createdBy", "username email")
            .populate("comments.userId", "username email");

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        res.status(200).json({ card });
    } catch (error) {
        console.error("Error fetching card:", error);
        res.status(500).json({ message: "Failed to fetch card" });
    }
});

// UPDATE card
router.put("/cards/:cardId", async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignee, tags } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;
        if (assignee !== undefined) updateData.assignee = assignee;
        if (tags !== undefined) updateData.tags = tags;

        const card = await Card.findByIdAndUpdate(
            req.params.cardId,
            updateData,
            { new: true }
        )
            .populate("assignee", "username email")
            .populate("createdBy", "username email");

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        res.status(200).json({ card });
    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).json({ message: "Failed to update card" });
    }
});

// DELETE card
router.delete("/cards/:cardId", async (req, res) => {
    try {
        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Remove card from column
        await Column.findByIdAndUpdate(card.columnId, {
            $pull: { cards: card._id },
        });

        // Delete the card
        await Card.findByIdAndDelete(req.params.cardId);

        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ message: "Failed to delete card" });
    }
});

// MOVE card to different column
router.put("/cards/:cardId/move", async (req, res) => {
    try {
        const { newColumnId, newOrder } = req.body;

        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const oldColumnId = card.columnId;

        // Remove from old column
        await Column.findByIdAndUpdate(oldColumnId, {
            $pull: { cards: card._id },
        });

        // Add to new column
        const newColumn = await Column.findById(newColumnId);
        if (!newColumn) {
            return res.status(404).json({ message: "New column not found" });
        }

        // Insert at specific position
        newColumn.cards.splice(newOrder, 0, card._id);
        await newColumn.save();

        // Update card
        card.columnId = newColumnId;
        card.order = newOrder;
        await card.save();

        // Reorder remaining cards in both columns
        await reorderCardsInColumn(oldColumnId);
        await reorderCardsInColumn(newColumnId);

        res.status(200).json({ card });
    } catch (error) {
        console.error("Error moving card:", error);
        res.status(500).json({ message: "Failed to move card" });
    }
});

// REORDER card within same column
router.put("/cards/:cardId/reorder", async (req, res) => {
    try {
        const { newOrder } = req.body;

        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const column = await Column.findById(card.columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found" });
        }

        // Remove card from current position
        const cardIndex = column.cards.indexOf(card._id);
        if (cardIndex > -1) {
            column.cards.splice(cardIndex, 1);
        }

        // Insert at new position
        column.cards.splice(newOrder, 0, card._id);
        await column.save();

        // Update card order
        card.order = newOrder;
        await card.save();

        // Reorder all cards in column
        await reorderCardsInColumn(card.columnId);

        res.status(200).json({ card });
    } catch (error) {
        console.error("Error reordering card:", error);
        res.status(500).json({ message: "Failed to reorder card" });
    }
});

// ADD comment to card
router.post("/cards/:cardId/comments", async (req, res) => {
    try {
        const { userId, text } = req.body;

        if (!userId || !text) {
            return res.status(400).json({ message: "userId and text are required" });
        }

        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        card.comments.push({
            userId,
            text,
            createdAt: new Date(),
        });

        await card.save();

        // Populate and return updated card
        const populatedCard = await Card.findById(card._id)
            .populate("comments.userId", "username email");

        res.status(200).json({ card: populatedCard });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
    }
});

// SEARCH cards
router.get("/cards/search", async (req, res) => {
    try {
        const { boardId, query } = req.query;

        if (!boardId || !query) {
            return res.status(400).json({ message: "boardId and query are required" });
        }

        const cards = await Card.find({
            boardId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        })
            .populate("assignee", "username email")
            .populate("createdBy", "username email");

        res.status(200).json({ cards });
    } catch (error) {
        console.error("Error searching cards:", error);
        res.status(500).json({ message: "Failed to search cards" });
    }
});

// FILTER cards
router.post("/cards/filter", async (req, res) => {
    try {
        const { boardId, priority, assignee, tags, dueDateFilter } = req.body;

        if (!boardId) {
            return res.status(400).json({ message: "boardId is required" });
        }

        const filter = { boardId };

        if (priority) {
            filter.priority = priority;
        }

        if (assignee) {
            filter.assignee = assignee;
        }

        if (tags && tags.length > 0) {
            filter.tags = { $in: tags };
        }

        if (dueDateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (dueDateFilter) {
                case "overdue":
                    filter.dueDate = { $lt: today, $ne: null };
                    break;
                case "today":
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    filter.dueDate = { $gte: today, $lt: tomorrow };
                    break;
                case "week":
                    const nextWeek = new Date(today);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    filter.dueDate = { $gte: today, $lt: nextWeek };
                    break;
            }
        }

        const cards = await Card.find(filter)
            .populate("assignee", "username email")
            .populate("createdBy", "username email")
            .sort({ order: 1 });

        res.status(200).json({ cards });
    } catch (error) {
        console.error("Error filtering cards:", error);
        res.status(500).json({ message: "Failed to filter cards" });
    }
});

// Helper function to reorder cards in a column
async function reorderCardsInColumn(columnId) {
    const column = await Column.findById(columnId).populate("cards");
    if (!column) return;

    const updatePromises = column.cards.map((card, index) =>
        Card.findByIdAndUpdate(card._id, { order: index })
    );

    await Promise.all(updatePromises);
}

module.exports = router;
