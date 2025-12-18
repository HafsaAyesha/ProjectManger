import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarProfile from '../SidebarProfile/SidebarProfile';
import './PMSidebar.css';

const PMSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
        { path: '/kanban', label: 'Kanban', icon: 'fa-table-columns' },
        { path: '/projects', label: 'Projects', icon: 'fa-folder-open' },
    ];

    return (
        <div className={`pm-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SidebarProfile user={user} />

            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>

            <ul className="sidebar-nav">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname.startsWith(item.path) ? 'active' : ''}
                            title={!isExpanded ? item.label : ''}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PMSidebar;
