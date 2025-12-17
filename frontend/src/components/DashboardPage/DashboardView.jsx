import React from 'react';
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import "./DashboardView.css";

export function DashboardView({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    // Normalize status check: 'in-progress' or 'inProgress'
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress" || t.status === "inProgress").length;
    // Handle priority if it exists, otherwise 0
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const stats = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Completed",
            value: completedTasks,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "High Priority",
            value: highPriorityTasks,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    // Get tasks by status
    const tasksByStatus = {
        backlog: tasks.filter((t) => t.status === "backlog").length,
        todo: tasks.filter((t) => t.status === "todo").length,
        "in-progress": tasks.filter((t) => t.status === "in-progress" || t.status === "inProgress").length,
        review: tasks.filter((t) => t.status === "review").length,
        done: tasks.filter((t) => t.status === "done").length,
    };

    return (
        <div className="space-y-6 dashboard-view">
            <div>
                <h2 className="text-gray-900 mb-1">Dashboard</h2>
                <p className="text-gray-500">Overview of your project progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="p-6">
                <h3 className="mb-4 text-gray-900">Completion Rate</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="text-gray-900">{completionRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="mb-4 text-gray-900">Task Distribution</h3>
                <div className="space-y-3">
                    {Object.entries(tasksByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-sm text-gray-600 capitalize">
                                    {status.replace("-", " ")}
                                </div>
                                <Progress
                                    value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                                    className="h-2 flex-1 max-w-xs"
                                />
                            </div>
                            <span className="text-sm text-gray-900 min-w-[2rem] text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
