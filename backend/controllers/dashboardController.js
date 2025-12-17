const Project = require("../models/project");
const ProjectMilestone = require("../models/projectMilestone");
const ProjectFinance = require("../models/projectFinance");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
    try {
        const { id } = req.query; // User ID

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userId = new mongoose.Types.ObjectId(id);

        // Parallel execution for better performance
        const [
            projects,
            allMilestones,
            finances
        ] = await Promise.all([
            Project.find({ createdBy: userId }),
            // We need to look up milestones for projects created by this user
            // Since milestones have createdBy reference, use that
            ProjectMilestone.find({ createdBy: userId }).populate('projectId', 'title'),
            // Finances need to be looked up by project IDs (but we can fetch all for user's projects)
            // Or simpler: fetch all finance records where project belongs to user
            // However, ProjectFinance doesn't have createdBy directly usually, it ref Project
            // So we'll fetch via project IDs
            // Let's do a meaningful query later or filter in memory if dataset is small. 
            // Better: Find projects first, then find finances for those project IDs.
            // We already finding projects.
            null
        ]);

        const projectIds = projects.map(p => p._id);

        // Fetch finances for these projects
        const projectFinances = await ProjectFinance.find({ projectId: { $in: projectIds } });

        // Calculate Metrics
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;

        // Total Clients (Unique)
        const uniqueClients = new Set(projects.map(p => p.clientName).filter(Boolean));
        const totalClients = uniqueClients.size;

        // Completion Rate
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

        // Net Profit Calculation
        // ProjectFinance schema: totalBudget, paymentsReceived[], expenses[]
        let totalRevenue = 0;
        let totalCost = 0; // Expenses

        projectFinances.forEach(finance => {
            const received = finance.paymentsReceived.reduce((sum, p) => sum + (p.amount || 0), 0);
            const expenses = finance.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
            totalRevenue += received;
            totalCost += expenses;
        });

        // Also fallback to Project model budget/cost if ProjectFinance not used widely yet?
        // User prompt says: Net Profit: Sum of (actual_revenue - actual_cost)
        // My analysis of Project model showed NO actualRevenue/actualCost fields.
        // My analysis of ProjectFinance showed paymentsReceived and expenses.
        // So I will use ProjectFinance.
        const netProfit = totalRevenue - totalCost;

        // Project Status Breakdown
        const statusBreakdown = {
            not_started: 0,
            in_progress: 0,
            completed: 0,
            on_hold: 0
        };
        // Normalize status strings if needed. Project model enum: ['active', 'on-hold', 'completed']
        // 'active' usually maps to 'in_progress' or just 'active'
        projects.forEach(p => {
            const s = p.status.toLowerCase();
            if (s === 'active' || s === 'in_progress') statusBreakdown.in_progress++;
            else if (s === 'completed') statusBreakdown.completed++;
            else if (s === 'on-hold' || s === 'on_hold') statusBreakdown.on_hold++;
            else statusBreakdown.not_started++; // default fallback
        });


        // Upcoming Milestones
        // Filter: status != completed, dueDate >= today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingMilestones = allMilestones
            .filter(m => {
                const isPending = m.status !== 'completed' && !m.isCompleted;
                const hasDueDate = m.dueDate;
                // If past due, it goes to overdue stats, not upcoming?
                // Request says: "List of next 5 upcoming milestones sorted by due date"
                // Usually implies future dates.
                return isPending && hasDueDate && new Date(m.dueDate) >= today;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5)
            .map(m => {
                const dueDate = new Date(m.dueDate);
                const diffTime = dueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return {
                    id: m._id,
                    title: m.title,
                    projectName: m.projectId?.title || 'Unknown Project',
                    dueDate: m.dueDate,
                    daysRemaining: diffDays,
                    status: m.status
                };
            });

        // Overdue Tasks count
        const overdueTasks = allMilestones.filter(m => {
            return (m.status !== 'completed' && !m.isCompleted) && m.dueDate && new Date(m.dueDate) < today;
        }).length;

        // Top Clients
        const clientCounts = {};
        projects.forEach(p => {
            if (p.clientName) {
                clientCounts[p.clientName] = (clientCounts[p.clientName] || 0) + 1;
            }
        });

        const topClients = Object.entries(clientCounts)
            .map(([name, count]) => ({ name, projectCount: count }))
            .sort((a, b) => b.projectCount - a.projectCount)
            .slice(0, 3); // Top 3


        // Monthly Revenue (Mock or calculated if Date available)
        // Finance payments have dates.
        const months = 6;
        const monthlyRevenue = [];
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' });
            monthlyRevenue.push({ month: key, revenue: 0, year: d.getFullYear(), monthIdx: d.getMonth() });
        }

        projectFinances.forEach(f => {
            f.paymentsReceived.forEach(p => {
                if (p.date && p.amount) {
                    const pDate = new Date(p.date);
                    const pMonth = pDate.getMonth();
                    const pYear = pDate.getFullYear();

                    const period = monthlyRevenue.find(m => m.monthIdx === pMonth && m.year === pYear);
                    if (period) {
                        period.revenue += p.amount;
                    }
                }
            });
        });


        res.status(200).json({
            activeProjects,
            totalClients,
            netProfit,
            completionRate,
            projectStatusBreakdown: statusBreakdown,
            upcomingMilestones,
            monthlyRevenue: monthlyRevenue.map(({ month, revenue }) => ({ month, revenue })),
            topClients,
            overdueTasks
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error Fetching Statistics" });
    }
};
