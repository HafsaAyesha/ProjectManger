import React, { useState } from 'react';
import axios from 'axios';
import WorkspaceHeader from './components/WorkspaceHeader';
import WorkspaceTabs from './components/WorkspaceTabs';
import OverviewTab from './components/OverviewTab';
import NotesTab from './components/NotesTab';
import DetailsTab from './components/DetailsTab';
import DocumentsTab from './components/DocumentsTab';
import FinanceTab from './components/FinanceTab';
import ProgressTab from './components/ProgressTab';
import TechTab from './components/TechTab';
import './ProjectWorkspace.css';

const ProjectWorkspace = ({ project, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [milestones, setMilestones] = useState([]);

    // Fetch milestones at workspace level to share data and prevent flicker
    const fetchMilestones = React.useCallback(async () => {
        if (!project?._id) return;
        try {
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${project._id}/milestones`);
            setMilestones(response.data);
        } catch (err) {
            console.error('Error fetching milestones:', err);
        }
    }, [project._id]);

    React.useEffect(() => {
        fetchMilestones();
    }, [fetchMilestones]);

    // Calculate shared progress stats
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.isCompleted).length;
    const progressPercentage = totalMilestones === 0 ? 0 : (completedMilestones / totalMilestones) * 100;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <OverviewTab
                        project={project}
                        progressStats={{
                            progress: progressPercentage,
                            total: totalMilestones,
                            completed: completedMilestones
                        }}
                        onEditDetails={() => setActiveTab('details')}
                    />
                );
            case 'notes':
                return <NotesTab projectId={project._id} />;
            case 'details':
                return <DetailsTab project={project} onUpdate={onUpdate} />;
            case 'documents':
                return <DocumentsTab projectId={project._id} />;
            case 'finance':
                return <FinanceTab projectId={project._id} onUpdate={onUpdate} />;
            case 'progress':
                return (
                    <ProgressTab
                        projectId={project._id}
                        initialMilestones={milestones}
                        onMilestoneChange={fetchMilestones}
                        progressStats={{
                            progress: progressPercentage,
                            total: totalMilestones,
                            completed: completedMilestones
                        }}
                    />
                );
            case 'tech':
                return <TechTab project={project} onUpdate={onUpdate} />;
            default:
                return <OverviewTab project={project} />;
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '' },
        { id: 'notes', label: 'Notes', icon: '' },
        { id: 'details', label: 'Details', icon: '' },
        { id: 'documents', label: 'Documents', icon: '' },
        { id: 'finance', label: 'Finance', icon: '' },
        { id: 'progress', label: 'Progress', icon: '' },
        { id: 'tech', label: 'Tech', icon: '' },
    ];

    return (
        <div className="project-workspace">
            <WorkspaceHeader project={project} onBack={onBack} />

            <div className="workspace-content">
                <WorkspaceTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ProjectWorkspace;
