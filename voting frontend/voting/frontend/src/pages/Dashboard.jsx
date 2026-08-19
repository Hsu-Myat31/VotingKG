import { useEffect, useState } from "react";

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

        const isJpg = file.type === "image/jpeg" || file.type === "image/jpg" || /\.jpe?g$/i.test(file.name);

        if (!isJpg) {
            setError("Please choose a .jpg or .jpeg file.");
            event.target.value = "";
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

        const maxSizeInBytes = 150 * 1024;
        if (file.size > maxSizeInBytes) {
            setError("Please choose a JPG smaller than 150 KB. Large photos are too big for the database.");
            event.target.value = "";
            setFormData((previous) => ({ ...previous, photo: "" }));
            return;
        }

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
        setEditingId(null);
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

            resetForm();
            await loadCandidates();
        } catch (submitError) {
            console.error("Candidate save failed:", submitError);
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

                    <label>
                        Photo (.jpg)
                        <input type="file" accept=".jpg,.jpeg,image/jpeg" onChange={handlePhotoChange} />
                    </label>

                    {formData.photo && (
                        <div className="photo-preview-wrap">
                            <img src={formData.photo} alt="Selected candidate preview" className="candidate-photo preview-photo" />
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
                </form>

                <div className="sections-panel">
                    {loading ? (
                        <div className="candidate-card loading-card">Loading candidates...</div>
                    ) : (
                        SECTION_ORDER.map((sectionName) => {
                            const sectionCandidates = groupedCandidates[sectionName] || [];
                            const sectionVotes = sectionCandidates.reduce((sum, candidate) => sum + Number(candidate.votes || 0), 0);

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
                                                            <img src={candidate.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} alt={candidate.name} className="candidate-photo" />
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