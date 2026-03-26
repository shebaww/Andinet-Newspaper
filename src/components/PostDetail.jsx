// PostDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import CommentSection from "./CommentSection";
import Skeleton from "./common/Skeleton";
import SEO from "./common/SEO";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("No post ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching post with ID:", id);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() };
          console.log("Post found:", postData.title);
          setPost(postData);

          // Increment view count
          await updateDoc(docRef, { views: increment(1) });
        } else {
          console.log("No post found with ID:", id);
          setError("Article not found in the archives");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Skeleton width="20%" height="20px" margin="0 auto" />
          <Skeleton width="80%" height="100px" margin="20px auto" />
          <Skeleton width="40%" height="40px" margin="30px auto" />
        </div>
        <Skeleton height="500px" />
        <div className="readable-container" style={{ marginTop: "50px" }}>
          <Skeleton count={10} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="container"
        style={{ maxWidth: "700px", marginTop: "100px", marginBottom: "100px" }}
      >
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            border: "1px solid var(--silver-accent)",
            backgroundColor: "white",
          }}
        >
          <h1 className="h-large" style={{ margin: "0 0 20px 0" }}>
            404
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.2rem",
              marginBottom: "30px",
            }}
          >
            {error || "Article not found in the archives"}
          </p>
          <Link
            to="/"
            className="btn-heritage"
            style={{ textDecoration: "none" }}
          >
            RETURN TO FRONT PAGE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.imageUrl}
        url={`/post/${post.id}`}
        type="article"
      />

      <div className="container">
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
            borderBottom: "var(--hairline)",
            marginBottom: "40px",
          }}
        >
          <Link
            to="/"
            className="nav-link"
            style={{ fontSize: "14px", fontFamily: "var(--font-logo)" }}
          >
            The Andinet Gazette
          </Link>
        </div>

        <article className="grid-system" style={{ marginBottom: "100px" }}>
          <header
            style={{
              gridColumn: "span 12",
              textAlign: "center",
              marginBottom: "50px",
            }}
          >
            <span className="kicker" style={{ color: "#d32f2f" }}>
              {post.category}
            </span>
            <h1 className="h-giant" style={{ cursor: "default" }}>
              {post.title}
            </h1>
            <div
              className="byline"
              style={{
                borderTop: "1px solid black",
                borderBottom: "4px double black",
                padding: "15px 0",
                marginTop: "30px",
                maxWidth: "800px",
                margin: "30px auto 0 auto",
              }}
            >
              By {post.authorName} • Published{" "}
              {post.createdAt
                ?.toDate()
                .toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                .toUpperCase()}
            </div>
          </header>

          <div style={{ gridColumn: "span 12" }}>
            {post.imageUrl && (
              <div
                className="media-frame"
                style={{
                  marginBottom: "50px",
                  padding: "0",
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  width="100%"
                  height="auto"
                  style={{ width: "100%", height: "auto" }}
                />
                <div
                  className="caption-nyt"
                  style={{
                    marginTop: "10px",
                    fontSize: "11px",
                    textAlign: "center",
                  }}
                >
                  Staff Photo / Gazette Agency
                </div>
              </div>
            )}
          </div>

          <div className="readable-container" style={{ gridColumn: "span 12" }}>
            <div
              className="body-text"
              style={{
                fontSize: "1.25rem",
                color: "#111",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {post.content}
            </div>

            <section
              style={{
                marginTop: "100px",
                borderTop: "1px solid black",
                paddingTop: "60px",
              }}
            >
              <div
                className="zinc-box"
                style={{
                  backgroundColor: "var(--green-accent)",
                  color: "white",
                  border: "none",
                }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Editorial Note
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    fontStyle: "italic",
                    marginTop: "10px",
                  }}
                >
                  The Andinet Gazette is committed to journalistic integrity.
                  Correspondence regarding this article should be addressed to
                  the editorial board.
                </p>
              </div>
              <CommentSection postId={post.id} />
            </section>
          </div>
        </article>
      </div>
    </>
  );
};

export default PostDetail;
