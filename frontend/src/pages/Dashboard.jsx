import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "/api/candidates";
const SECTION_ORDER = ["King", "Queen", "Style", "Smart", "Mr. Popular", "Ms. Popular"];

function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        no: "",
        name: "",
        gender: "Male",
        age: "",
        major: "",
        talent: "",
        bio: "",
        photo: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");

    const loadCandidates = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load candidates");
            }

            const data = await response.json();
            setCandidates(data);
            setError("");
        } catch (loadError) {
            setError(loadError.message || "Failed to load candidates.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCandidates();
    }, []);

    const groupedCandidates = SECTION_ORDER.reduce((sections, sectionName) => {
        sections[sectionName] = candidates.filter((candidate) => candidate.category === sectionName);
        return sections;
    }, {});

    const resolveImageUrl = (photoValue) => {
        if (!photoValue) {
            return "";
        }

        if (photoValue.startsWith("http://") || photoValue.startsWith("https://") || photoValue.startsWith("data:")) {
            return photoValue;
        }

        const normalizedPath = photoValue.replace(/^\/+/, "");
        if (normalizedPath.startsWith("api/")) {
            return `http://localhost:8080/${normalizedPath}`;
        }

        return `http://localhost:8080/api/${normalizedPath}`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFileName("");
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

        const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(file.name);

        if (!isImage) {
            setError("Please choose a valid image file.");
            event.target.value = "";
            setSelectedFileName("");
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

        const maxSizeInBytes = 20 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setError("Please choose an image smaller than 20 MB.");
            event.target.value = "";
            setSelectedFileName("");
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

        setSelectedFileName(file.name);

        const reader = new FileReader();
        reader.onload = () => {
            setError("");
            setFormData((previous) => ({ ...previous, photo: reader.result }));
        };
        reader.onerror = () => {
            setError("Failed to read the selected photo file.");
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData({
            no: "",
            name: "",
            gender: "Male",
            age: "",
            major: "",
            talent: "",
            bio: "",
            photo: "",
        });
        setSelectedFileName("");
        setEditingId(null);
    };

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const candidateName = formData.name.trim();
        const candidateNo = Number(formData.no) || 0;

        if (!candidateName) {
            return;
        }

        try {
            const candidateToEdit = editingId !== null
                ? candidates.find((candidate) => candidate.id === editingId)
                : null;

            const payload = {
                no: candidateNo,
                name: candidateName,
                gender: formData.gender,
                age: Number(formData.age) || 0,
                major: formData.major.trim(),
                talent: formData.talent.trim(),
                bio: formData.bio.trim(),
                photo: formData.photo.trim(),
                votes: candidateToEdit ? Number(candidateToEdit.votes || 0) : 0,
            };

            const requestOptions = {
                method: editingId !== null ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            };

            const endpoint = editingId !== null ? `${API_URL}/${editingId}` : API_URL;
            const response = await fetch(endpoint, requestOptions);
            const responseText = await response.text();

            if (!response.ok) {
                const message = responseText ? responseText : (editingId !== null ? "Unable to update candidate." : "Unable to add candidate.");
                throw new Error(message);
            }

            const successText = editingId !== null ? "Candidate updated successfully." : "Candidate uploaded successfully.";
            resetForm();
            setSuccessMessage(successText);
            setError("");
            await loadCandidates();
        } catch (submitError) {
            console.error("Candidate save failed:", submitError);
            setSuccessMessage("");
            setError(submitError.message || "Something went wrong while saving the candidate.");
        }
    };

    const handleEdit = (candidate) => {
        setEditingId(candidate.id);
        setFormData({
            no: String(candidate.no ?? ""),
            name: candidate.name,
            gender: candidate.gender || "Male",
            age: String(candidate.age ?? ""),
            major: candidate.major || "",
            talent: candidate.talent || "",
            bio: candidate.bio || "",
            photo: candidate.photo || "",
        });
    };

    const handleDelete = async (candidateId) => {
        const candidate = candidates.find((item) => item.id === candidateId);
        const candidateName = candidate?.name || "this candidate";

        const confirmed = window.confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${candidateId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Unable to delete candidate.");
            }

            if (editingId === candidateId) {
                resetForm();
            }

            await loadCandidates();
        } catch (deleteError) {
            setError(deleteError.message || "Could not delete candidate.");
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="dashboard-kicker">Admin Dashboard</p>
                    <h1>Candidate Voting Board</h1>
                </div>
                <div className="dashboard-total">
                    <span>Total Votes</span>
                    <strong>{candidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0)}</strong>
                </div>
            </div>

            <div className="dashboard-layout">
                <form className="candidate-form" onSubmit={handleSubmit}>
                    <h2>{editingId !== null ? "Edit Candidate" : "Add Candidate"}</h2>

                    <div className="form-grid">
                        <label>
                            No.
                            <input type="number" name="no" value={formData.no} onChange={handleChange} placeholder="1" min="1" />
                        </label>

                        <label>
                            Name
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter candidate name" />
                        </label>

                        <label>
                            Gender
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>

                        <label>
                            Age
                            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="18" min="1" />
                        </label>

                        <label>
                            Major
                            <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Computer Science" />
                        </label>

                        <label>
                            Talent
                            <input type="text" name="talent" value={formData.talent} onChange={handleChange} placeholder="Singing" />
                        </label>
                    </div>

                    <label>
                        Bio
                        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short bio..." rows="3" />
                    </label>

                    <label className="photo-upload">
                        <span className="photo-upload-title">Photo (all image types)</span>
                        <span className="photo-upload-box">
                            <span className="upload-icon">⇪</span>
                            <span>{selectedFileName || (formData.photo ? "Change photo" : "Upload candidate photo")}</span>
                        </span>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="photo-input" />
                    </label>

                    {formData.photo && (
                        <div className="photo-preview-wrap">
                            <img src={resolveImageUrl(formData.photo)} alt="Selected candidate preview" className="candidate-photo preview-photo" />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="primary-button">
                            {editingId !== null ? "Save Changes" : "Add Candidate"}
                        </button>

                        {editingId !== null && (
                            <button type="button" className="secondary-button" onClick={resetForm}>
                                Cancel
                            </button>
                        )}
                    </div>

                    {error && <p className="dashboard-error">{error}</p>}
                    {successMessage && <p className="dashboard-success">{successMessage}</p>}
                </form>

                <div className="sections-panel">
                    {loading ? (
                        <div className="candidate-card loading-card">Loading candidates...</div>
                    ) : (
                        SECTION_ORDER.map((sectionName) => {
                            const sectionCandidates = groupedCandidates[sectionName] || [];
                            const sectionVotes = sectionCandidates.reduce((sum, candidate) => sum + Number(candidate.votes || 1), 0);

                            return (
                                <div className="section-card" key={sectionName}>
                                    <div className="section-header">
                                        <h2>{sectionName}</h2>
                                        <span>{sectionCandidates.length} candidate(s)</span>
                                    </div>

                                    {sectionCandidates.length === 0 ? (
                                        <p className="empty-section">No candidates in this section yet.</p>
                                    ) : (
                                        <div className="section-list">
                                            {sectionCandidates.map((candidate) => {
                                                const percentage = sectionVotes === 0 ? 0 : (candidate.votes / sectionVotes) * 100;

                                                return (
                                                    <div className="candidate-card" key={candidate.id}>
                                                        <div className="profile-row">
                                                            <img src={resolveImageUrl(candidate.photo) || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} alt={candidate.name} className="candidate-photo" />
                                                            <div className="profile-info">
                                                                <div className="candidate-name-row">
                                                                    <span className="candidate-no">#{candidate.no ?? "-"}</span>
                                                                    <h3>{candidate.name}</h3>
                                                                </div>
                                                                <p className="candidate-meta">{candidate.gender} • {candidate.age} yrs • {candidate.major}</p>
                                                                <p className="candidate-meta">Talent: {candidate.talent}</p>
                                                                <p className="candidate-bio">{candidate.bio}</p>
                                                            </div>
                                                        </div>

                                                        <div className="candidate-stats">
                                                            <span>{candidate.votes} votes</span>
                                                            <span>{Math.round(percentage)}%</span>
                                                        </div>

                                                        <div className="progress-bar" aria-label={`${candidate.name} vote progress`}>
                                                            <span style={{ width: `${percentage}%` }} />
                                                        </div>

                                                        <div className="candidate-actions">
                                                            <button type="button" className="edit-button" onClick={() => handleEdit(candidate)}>Edit</button>
                                                            <button type="button" className="delete-button" onClick={() => handleDelete(candidate.id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;