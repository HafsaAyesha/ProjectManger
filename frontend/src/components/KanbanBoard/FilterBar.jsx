import React from "react";
import "./FilterBar.css";

const FilterBar = ({ filters, setFilters }) => {
    const handleClearFilters = () => {
        setFilters({
            priority: null,
            assignee: null,
            tags: [],
            search: "",
        });
    };

    const hasActiveFilters =
        filters.priority ||
        filters.assignee ||
        filters.tags.length > 0 ||
        filters.search;

    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search cards..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="filter-search-input"
                />
            </div>

            <select
                value={filters.priority || ""}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        priority: e.target.value || null,
                    })
                }
                className="filter-select"
            >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
            </select>

            {hasActiveFilters && (
                <button onClick={handleClearFilters} className="filter-clear-btn">
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default FilterBar;
