import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PMNavbar from "../../components/PMNavbar/PMNavbar";
import PMSidebar from "../../components/PMSidebar/PMSidebar";
import PMFooter from "../../components/PMFooter/PMFooter";
import HeroSection from "../../components/FreelanceProfilePage/HeroSection";
import ProfileEditModal from "../../components/FreelanceProfilePage/ProfileEditModal";
import ExperienceSection from "../../components/FreelanceProfilePage/ExperienceSection";
import EducationSection from "../../components/FreelanceProfilePage/EducationSection";
import PersonalInfoSection from "../../components/FreelanceProfilePage/PersonalInfoSection";
import ProfessionalSummary from "../../components/FreelanceProfilePage/ProfessionalSummary";
import DashboardStats from "../../components/FreelanceProfilePage/DashboardStats";
import "./FreelancerProfile.css";

const FreelancerProfile = () => {
    // --- State ---
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [stats, setStats] = useState({});
    const [earningsData, setEarningsData] = useState({ labels: [], data: [] });
    const [skillsData, setSkillsData] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // UI States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editHeader, setEditHeader] = useState(false); // For inline Hero edit toggle
    const [editSummary, setEditSummary] = useState(false); // New: Independent edit for Summary
    const [editPersonal, setEditPersonal] = useState(false); // New: Independent edit for Personal Details
    const [editExperience, setEditExperience] = useState(false);
    const [editEducation, setEditEducation] = useState(false);
    const [editSkills, setEditSkills] = useState(false);
    const [editCertifications, setEditCertifications] = useState(false);

    // --- Fetch Data ---
    const fetchData = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser || !storedUser._id) return;

            const userId = storedUser._id;

            const [userRes, dashboardRes, earningsRes, skillsRes, activityRes] = await Promise.all([
                axios.get(`http://localhost:1000/api/v2/profile/${userId}`),
                axios.get(`http://localhost:1000/api/v2/stats/dashboard/${userId}`),
                axios.get(`http://localhost:1000/api/v2/stats/chart/earnings/${userId}`),
                axios.get(`http://localhost:1000/api/v2/stats/chart/skills/${userId}`),
                axios.get(`http://localhost:1000/api/v2/stats/activity/${userId}`)
            ]);

            setUser(userRes.data.user);
            setFormData(userRes.data.user.profile || {});

            setStats(dashboardRes.data);
            setEarningsData(earningsRes.data);
            setSkillsData(skillsRes.data);
            setActivities(activityRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers ---

    // General Profile Update (Hero/Modal)
    const handleProfileUpdate = async (updatedProfileData) => {
        try {
            const userId = user._id;
            const res = await axios.put(`http://localhost:1000/api/v2/profile/${userId}`, {
                profile: { ...formData, ...updatedProfileData }
            });
            setUser(res.data.user);
            setFormData(res.data.user.profile);
            setEditHeader(false);
            setEditSkills(false);
            setEditCertifications(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Experience Handlers
    const handleAddExperience = async () => {
        try {
            const userId = user._id;
            const newExp = { title: "New Role", company: "Company", year: "2023", description: "Description" };
            const res = await axios.post(`http://localhost:1000/api/v2/experience/${userId}`, newExp);
            setFormData(res.data.user.profile);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateExperience = async (index, field, value) => {
        const newExpList = [...(formData.experience || [])];
        newExpList[index][field] = value;
        setFormData({ ...formData, experience: newExpList });
    };

    const handleSaveExperience = async () => {
        if (editExperience) {
            handleProfileUpdate({ experience: formData.experience });
            setEditExperience(false);
        } else {
            setEditExperience(true);
        }
    };

    const handleDeleteExperience = async (index) => {
        try {
            const expId = formData.experience[index]._id;
            if (!expId) {
                const newExp = formData.experience.filter((_, i) => i !== index);
                setFormData({ ...formData, experience: newExp });
                return;
            }
            const res = await axios.delete(`http://localhost:1000/api/v2/experience/${user._id}/${expId}`);
            setFormData(res.data.user.profile);
        } catch (error) {
            console.error(error);
        }
    };

    // Education Handlers
    const handleAddEducation = async () => {
        try {
            const userId = user._id;
            const newEdu = { degree: "Degree", institution: "Institution", year: "2023" };
            const res = await axios.post(`http://localhost:1000/api/v2/education/${userId}`, newEdu);
            setFormData(res.data.user.profile);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateEducation = async (index, field, value) => {
        const newEduList = [...(formData.education || [])];
        newEduList[index][field] = value;
        setFormData({ ...formData, education: newEduList });
    };

    const handleSaveEducation = async () => {
        if (editEducation) {
            handleProfileUpdate({ education: formData.education });
            setEditEducation(false);
        } else {
            setEditEducation(true);
        }
    };

    const handleDeleteEducation = async (index) => {
        try {
            const eduId = formData.education[index]._id;
            if (!eduId) return;
            const res = await axios.delete(`http://localhost:1000/api/v2/education/${user._id}/${eduId}`);
            setFormData(res.data.user.profile);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;

    return (
        <div className="profile-page-wrapper">
            <PMNavbar user={user} />
            <div className="profile-body">
                <PMSidebar />
                <div className="profile-content">

                    <HeroSection
                        user={user}
                        formData={formData}
                        editHeader={editHeader}
                        setEditHeader={setEditHeader}
                        handleChange={handleFieldChange}
                        handleSave={() => handleProfileUpdate({})}
                    />

                    {/* Tabs */}
                    <div className="profile-tabs">
                        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            Profile Sections
                        </button>
                        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            Dashboard & Stats
                        </button>
                    </div>

                    {activeTab === 'profile' ? (
                        <div className="profile-sections-vertical">

                            <div className="profile-header-details-row">
                                <ProfessionalSummary
                                    formData={formData}
                                    editMode={editSummary}
                                    setEditMode={setEditSummary}
                                    handleChange={handleFieldChange}
                                    onSave={() => {
                                        handleProfileUpdate({ bio: formData.bio });
                                        setEditSummary(false);
                                    }}
                                />
                                <PersonalInfoSection
                                    user={user}
                                    formData={formData}
                                    editMode={editPersonal}
                                    setEditMode={setEditPersonal}
                                    handleChange={handleFieldChange}
                                    onSave={() => {
                                        handleProfileUpdate({ phone: formData.phone, hourlyRate: formData.hourlyRate });
                                        setEditPersonal(false);
                                    }}
                                />
                            </div>

                            {/* Skills Section - Inline for now as requested by user originally or componentize further?
                                I'll keep it inline-ish or abstract it if I created a component. 
                                I didn't create a specific SkillSection component in the generic list, but I created SkillUsage for stats.
                                The prompt list included "SkillUsage". 
                                The original file had inline Skills. 
                                I will reimplement the inline Skills section here as it was in the refactored version I tried to make.
                            */}
                            <div className="profile-card">
                                <div className="card-header-row">
                                    <h3>Skills</h3>
                                    <button
                                        className="btn-icon-edit"
                                        onClick={() => editSkills ? handleProfileUpdate({ skills: formData.skills }) : setEditSkills(true)}
                                    >
                                        <i className={`fas ${editSkills ? 'fa-save' : 'fa-pen'}`}></i>
                                    </button>
                                </div>
                                <div className="skills-container">
                                    {(formData.skills || []).map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill.name} <small>({skill.level})</small>
                                            {editSkills && <i className="fas fa-times remove-skill" onClick={() => {
                                                const newSkills = formData.skills.filter((_, i) => i !== index);
                                                handleFieldChange("skills", newSkills);
                                            }}></i>}
                                        </span>
                                    ))}
                                </div>
                                {editSkills && (
                                    <div className="add-skill-form">
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input type="text" id="newSkillName" placeholder="Skill" />
                                            <select id="newSkillLevel">
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                            <button className="btn-add-mini" onClick={() => {
                                                const name = document.getElementById('newSkillName').value;
                                                const level = document.getElementById('newSkillLevel').value;
                                                if (name) {
                                                    const newSkills = [...(formData.skills || []), { name, level }];
                                                    handleFieldChange("skills", newSkills);
                                                    document.getElementById('newSkillName').value = '';
                                                }
                                            }}><i className="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ExperienceSection
                                experience={formData.experience}
                                editMode={editExperience}
                                onAdd={handleAddExperience}
                                onSave={handleSaveExperience}
                                onDelete={handleDeleteExperience}
                                handleChange={handleUpdateExperience}
                            />

                            <EducationSection
                                education={formData.education}
                                editMode={editEducation}
                                onAdd={handleAddEducation}
                                onSave={handleSaveEducation}
                                onDelete={handleDeleteEducation}
                                handleChange={handleUpdateEducation}
                            />

                            {/* Certifications - Keeping consistent with original plan */}
                            <div className="profile-card">
                                <div className="card-header-row">
                                    <h3>Certifications</h3>
                                    <div className="header-actions">
                                        {editCertifications && <button className="btn-add-section-mini" onClick={() => {
                                            const newCerts = [...(formData.certifications || []), { name: "", organization: "", date: "" }];
                                            handleFieldChange("certifications", newCerts);
                                        }}><i className="fas fa-plus"></i> Add</button>}
                                        <button
                                            className="btn-icon-edit"
                                            onClick={() => editCertifications ? handleProfileUpdate({ certifications: formData.certifications }) : setEditCertifications(true)}
                                        >
                                            <i className={`fas ${editCertifications ? 'fa-save' : 'fa-pen'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="cert-list">
                                    {(formData.certifications || []).map((cert, index) => (
                                        <div key={index} className="cert-item">
                                            {editCertifications ? (
                                                <div className="edit-group">
                                                    <input type="text" placeholder="Certificate Name" value={cert.name} onChange={(e) => {
                                                        const newCerts = [...formData.certifications];
                                                        newCerts[index].name = e.target.value;
                                                        handleFieldChange("certifications", newCerts);
                                                    }} />
                                                    <input type="text" placeholder="Organization" value={cert.organization} onChange={(e) => {
                                                        const newCerts = [...formData.certifications];
                                                        newCerts[index].organization = e.target.value;
                                                        handleFieldChange("certifications", newCerts);
                                                    }} />
                                                    <input type="date" value={cert.date ? cert.date.split('T')[0] : ""} onChange={(e) => {
                                                        const newCerts = [...formData.certifications];
                                                        newCerts[index].date = e.target.value;
                                                        handleFieldChange("certifications", newCerts);
                                                    }} />
                                                    <button className="btn-delete-item" onClick={() => {
                                                        const newCerts = formData.certifications.filter((_, i) => i !== index);
                                                        handleFieldChange("certifications", newCerts);
                                                    }}>Delete</button>
                                                </div>
                                            ) : (
                                                <div className="cert-display">
                                                    <div className="cert-icon"><i className="fas fa-certificate"></i></div>
                                                    <div className="cert-details">
                                                        <h4>{cert.name}</h4>
                                                        <p>{cert.organization}</p>
                                                        <small>{cert.date ? new Date(cert.date).toLocaleDateString() : ""}</small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {!formData.certifications?.length && !editCertifications && <p className="text-muted">No certifications found.</p>}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <DashboardStats
                            stats={stats}
                            earningsData={earningsData}
                            skillsData={skillsData}
                            activities={activities}
                        />
                    )}

                    <ProfileEditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        formData={formData}
                        onSave={handleProfileUpdate}
                        handleChange={handleFieldChange}
                    />

                </div>
            </div>
            <PMFooter />
        </div>
    );
};

export default FreelancerProfile;
