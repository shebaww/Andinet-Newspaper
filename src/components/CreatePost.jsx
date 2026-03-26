import { useState, useEffect, useCallback } from "react";
import { sanitizeContent, sanitizeInput } from "../utils/sanitize";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Toast from "./common/Toast";

const CreatePost = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("News");
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("andinet_draft");
    if (saved) {
      const data = JSON.parse(saved);
      setTitle(data.title || "");
      setContent(data.content || "");
      setExcerpt(data.excerpt || "");
      setCategory(data.category || "News");
    }
  }, []);

  // Auto-save logic
  const autoSave = useCallback(() => {
    const data = { title, content, excerpt, category };
    localStorage.setItem("andinet_draft", JSON.stringify(data));
    setLastSaved(new Date().toLocaleTimeString());
  }, [title, content, excerpt, category]);

  useEffect(() => {
    const timer = setInterval(autoSave, 30000);
    return () => clearInterval(timer);
  }, [autoSave]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        title: sanitizeInput(title),
        content: sanitizeContent(content), // Sanitize content
        excerpt: sanitizeInput(excerpt || content.substring(0, 150) + "..."),
        category: sanitizeInput(category),
        imageUrl,
        authorId: user.uid,
        authorName: sanitizeInput(
          userProfile?.displayName || user.email.split("@")[0]
        ),
        status: "published",
        publishedAt: new Date(publishedAt),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
      };

      await addDoc(collection(db, "posts"), postData);
      localStorage.removeItem("andinet_draft");
      setToast({ message: "Article published successfully", type: "success" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      setToast({ message: "Failed to publish article", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1600px", padding: "0" }}>
      <div className="editor-layout">
        {/* Editor Panel */}
        <div className="editor-panel">
          <header style={{ marginBottom: "40px" }}>
            <h1 className="h-large" style={{ margin: 0 }}>
              NEW ARTICLE
            </h1>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-sans)",
                color: "#666",
                marginTop: "5px",
              }}
            >
              AUTO-SAVE ACTIVE {lastSaved && `(LAST SAVED: ${lastSaved})`}
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="editor-field">
              <label className="editor-label">Headline</label>
              <input
                className="editor-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter headline..."
                required
              />
            </div>

            <div className="grid-system" style={{ marginBottom: "30px" }}>
              <div style={{ gridColumn: "span 6" }}>
                <label className="editor-label">Category</label>
                <select
                  className="editor-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ borderBottom: "1px solid var(--silver-accent)" }}
                >
                  <option value="News">News</option>
                  <option value="Sports">Sports</option>
                  <option value="Opinion">Opinion</option>
                  <option value="Feature">Feature</option>
                  <option value="Arts">Arts & Entertainment</option>
                </select>
              </div>
              <div style={{ gridColumn: "span 6" }}>
                <label className="editor-label">Schedule Publication</label>
                <input
                  className="editor-input"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  style={{ borderBottom: "1px solid var(--silver-accent)" }}
                />
              </div>
            </div>

            <div className="editor-field">
              <label className="editor-label">Short Summary (Excerpt)</label>
              <textarea
                className="editor-input"
                style={{
                  fontSize: "1rem",
                  border: "1px solid var(--silver-accent)",
                  padding: "10px",
                }}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary for the homepage..."
                rows="2"
              />
            </div>

            <div className="editor-field">
              <label className="editor-label">Article Text</label>
              <textarea
                className="editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing..."
                required
              />
            </div>

            <div className="editor-field">
              <label className="editor-label">Featured Media</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: "12px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-heritage"
                style={{ flex: 1 }}
              >
                {loading ? "PUBLISHING..." : "PUBLISH TO PRESS"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-heritage"
                style={{
                  backgroundColor: "white",
                  color: "var(--text-ink)",
                  border: "1px solid var(--text-ink)",
                  flex: 1,
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div
              style={{
                borderBottom: "1px solid black",
                paddingBottom: "5px",
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              <span className="editor-label">Live Preview</span>
            </div>

            <span className="kicker" style={{ color: "#d32f2f" }}>
              {category}
            </span>
            <h1 className="h-giant">
              {title || "Your Headline Will Appear Here"}
            </h1>

            <div
              className="byline"
              style={{
                borderTop: "1px solid black",
                borderBottom: "4px double black",
                padding: "15px 0",
                marginTop: "20px",
              }}
            >
              By {userProfile?.displayName || user?.email?.split("@")[0]} •
              Published{" "}
              {new Date(publishedAt).toLocaleDateString().toUpperCase()}
            </div>

            {imagePreview && (
              <div
                className="media-frame"
                style={{ margin: "30px 0", padding: 0, border: "none" }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%" }}
                />
              </div>
            )}

            <div
              className="body-text"
              style={{
                fontSize: "1.2rem",
                marginTop: "30px",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {content || "Your article text will appear here as you type..."}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CreatePost;
