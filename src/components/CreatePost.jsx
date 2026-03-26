import { useState, useEffect, useCallback } from "react";
import { sanitizeContent, sanitizeInput } from "../utils/sanitize";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Toast from "./common/Toast";
import { uploadToImgBB, validateImage } from "../utils/imageUpload";

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
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
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
      setImageUrl(data.imageUrl || "");
    }
  }, []);

  // Auto-save logic
  const autoSave = useCallback(() => {
    const data = { title, content, excerpt, category, imageUrl };
    localStorage.setItem("andinet_draft", JSON.stringify(data));
    setLastSaved(new Date().toLocaleTimeString());
  }, [title, content, excerpt, category, imageUrl]);

  useEffect(() => {
    const timer = setInterval(autoSave, 30000);
    return () => clearInterval(timer);
  }, [autoSave]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
    setUploadingImage(true);

    try {
      validateImage(file);
      const result = await uploadToImgBB(file);
      setImageUrl(result.url);
      setToast({ message: "Image uploaded successfully!", type: "success" });
    } catch (error) {
      setImageError(error.message);
      setImageUrl("");
      setToast({ message: error.message, type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const postData = {
        title: sanitizeInput(title),
        content: sanitizeContent(content),
        excerpt: sanitizeInput(excerpt || content.substring(0, 150) + "..."),
        category: sanitizeInput(category),
        imageUrl: imageUrl || "",
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
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                style={{ fontSize: "12px" }}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div style={{ marginTop: "10px", color: "#666" }}>
                  Uploading image...
                </div>
              )}
              {imageError && (
                <div style={{ marginTop: "10px", color: "#d32f2f" }}>
                  Error: {imageError}
                </div>
              )}
              {imageUrl && !uploadingImage && (
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#2e7d32" }}>
                  ✓ Image uploaded successfully
                </div>
              )}
              <div style={{ marginTop: "10px", fontSize: "11px", color: "#666" }}>
                Or paste image URL directly:
                <input
                  type="text"
                  placeholder="https://i.ibb.co/xxxxx/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    fontSize: "12px"
                  }}
                />
              </div>
            </div>

            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px", border: "1px solid #ccc" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                    setImageUrl("");
                    setImageError("");
                  }}
                  style={{ marginLeft: "10px", cursor: "pointer", fontSize: "12px" }}
                >
                  Remove
                </button>
              </div>
            )}

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

            {(imagePreview || imageUrl) && (
              <div
                className="media-frame"
                style={{ margin: "30px 0", padding: 0, border: "none" }}
              >
                <img
                  src={imagePreview || imageUrl}
                  alt="Preview"
                  style={{ width: "100%" }}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
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
