// PostDetail.jsx - Mobile responsive version
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import CommentSection from "./CommentSection";
import Skeleton from "./common/Skeleton";
import SEO from "./common/SEO";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, userRole } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      console.log("🔍 ===== STARTING POST FETCH =====");
      console.log("📌 Post ID from URL:", id);
      console.log("👤 Current user:", user?.uid);
      console.log("🎭 User role:", userRole);
      console.log("🔐 Is authenticated:", !!user);
      
      if (!id) {
        console.log("❌ No ID provided");
        setError("No post ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching from Firestore: posts/", id);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        
        console.log("📄 Document exists?", docSnap.exists());
        console.log("🔑 Document metadata:", docSnap.metadata);
        
        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() };
          console.log("✅ Post found:", postData.title);
          console.log("📊 Post status:", postData.status);
          console.log("📝 Full post data:", postData);
          setPost(postData);

          // Increment view count - don't await to avoid blocking
          updateDoc(docRef, { views: increment(1) })
            .catch(err => console.warn("⚠️ View count update failed:", err));
          console.log("👁️ View count incremented");
        } else {
          console.log("❌❌❌ NO POST FOUND with ID:", id);
          console.log("🔍 This document does not exist in Firestore");
          setError("Article not found in the archives");
        }
      } catch (error) {
        console.error("💥💥💥 FIRESTORE ERROR 💥💥💥");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error object:", error);
        console.error("Error stack:", error.stack);
        setError(`Failed to load article: ${error.message || "Please try again."}`);
      } finally {
        setLoading(false);
        console.log("🏁 Fetch completed. Loading:", false, "Error:", !!error);
      }
    };

    fetchPost();
  }, [id, user, userRole]);

  if (loading) {
    console.log("⏳ Rendering loading state...");
    return (
      <div className="container" style={{ 
        marginTop: "clamp(30px, 8vh, 50px)",
        padding: "0 clamp(16px, 4vw, 20px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(30px, 8vh, 50px)" }}>
          <Skeleton width="clamp(100px, 30vw, 200px)" height="20px" margin="0 auto" />
          <Skeleton width="clamp(200px, 80vw, 600px)" height="clamp(60px, 10vh, 100px)" margin="20px auto" />
          <Skeleton width="clamp(120px, 40vw, 280px)" height="clamp(30px, 5vh, 40px)" margin="30px auto" />
        </div>
        <Skeleton height="clamp(300px, 50vh, 500px)" />
        <div className="readable-container" style={{ marginTop: "clamp(30px, 8vh, 50px)" }}>
          <Skeleton count={10} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    console.log("⚠️ Rendering error state. Error:", error, "Post exists:", !!post);
    return (
      <div
        className="container"
        style={{ 
          maxWidth: "min(700px, 90%)", 
          marginTop: "clamp(50px, 15vh, 100px)", 
          marginBottom: "clamp(50px, 15vh, 100px)",
          padding: "0 clamp(16px, 4vw, 20px)"
        }}
      >
        <div
          style={{
            padding: "clamp(40px, 10vw, 60px) clamp(20px, 5vw, 40px)",
            textAlign: "center",
            border: "1px solid var(--silver-accent)",
            backgroundColor: "white",
          }}
        >
          <h1 className="h-large" style={{ 
            margin: "0 0 clamp(15px, 4vh, 20px) 0",
            fontSize: "clamp(48px, 12vw, 72px)"
          }}>
            404
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 4vw, 1.2rem)",
              marginBottom: "clamp(20px, 5vh, 30px)",
              lineHeight: "1.5"
            }}
          >
            {error || "Article not found in the archives"}
          </p>
          <Link
            to="/"
            className="btn-heritage"
            style={{ 
              textDecoration: "none",
              display: "inline-block",
              padding: "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)",
              fontSize: "clamp(11px, 3vw, 12px)"
            }}
          >
            RETURN TO FRONT PAGE
          </Link>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering full article:", post.title);
  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.imageUrl}
        url={`/post/${post.id}`}
        type="article"
      />

      <div className="container" style={{
        padding: "0 clamp(16px, 4vw, 20px)"
      }}>
        <div
          style={{
            textAlign: "center",
            padding: "clamp(15px, 4vh, 20px) 0",
            borderBottom: "var(--hairline)",
            marginBottom: "clamp(30px, 6vh, 40px)",
          }}
        >
          <Link
            to="/"
            className="nav-link"
            style={{ 
              fontSize: "clamp(12px, 4vw, 14px)", 
              fontFamily: "var(--font-logo)",
              textDecoration: "none"
            }}
          >
            The Andinet Gazette
          </Link>
        </div>

        <article className="grid-system" style={{ marginBottom: "clamp(60px, 15vh, 100px)" }}>
          <header
            style={{
              gridColumn: "span 12",
              textAlign: "center",
              marginBottom: "clamp(30px, 8vh, 50px)",
            }}
          >
            <span className="kicker" style={{ 
              color: "#d32f2f",
              fontSize: "clamp(11px, 3vw, 12px)",
              display: "inline-block",
              marginBottom: "clamp(10px, 3vh, 15px)"
            }}>
              {post.category}
            </span>
            <h1 className="h-giant" style={{ 
              cursor: "default",
              fontSize: "clamp(28px, 8vw, 48px)",
              lineHeight: "1.2",
              margin: "0 auto",
              maxWidth: "min(1000px, 100%)",
              padding: "0 clamp(10px, 3vw, 20px)",
              wordBreak: "break-word"
            }}>
              {post.title}
            </h1>
            <div
              className="byline"
              style={{
                borderTop: "1px solid black",
                borderBottom: "4px double black",
                padding: "clamp(12px, 3vh, 15px) clamp(16px, 4vw, 20px)",
                marginTop: "clamp(20px, 5vh, 30px)",
                maxWidth: "min(800px, 100%)",
                margin: "clamp(20px, 5vh, 30px) auto 0 auto",
                fontSize: "clamp(10px, 3vw, 12px)",
                lineHeight: "1.4"
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
                  marginBottom: "clamp(30px, 8vh, 50px)",
                  padding: "0",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  style={{ 
                    width: "100%", 
                    height: "auto",
                    maxWidth: "min(100%, 800px)",
                    objectFit: "cover"
                  }}
                />
                {post.caption && (
                  <div
                    className="caption-nyt"
                    style={{
                      marginTop: "clamp(8px, 2vh, 10px)",
                      fontSize: "clamp(10px, 2.5vw, 11px)",
                      textAlign: "center",
                      color: "#666",
                      maxWidth: "min(800px, 100%)"
                    }}
                  >
                    {post.caption}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="readable-container" style={{ 
            gridColumn: "span 12",
            maxWidth: "min(800px, 100%)",
            margin: "0 auto"
          }}>
            <div
              className="body-text"
              style={{
                fontSize: "clamp(1rem, 4vw, 1.25rem)",
                color: "#111",
                lineHeight: "clamp(1.5, 5vw, 1.6)",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                padding: "0 clamp(10px, 3vw, 20px)"
              }}
            >
              {post.content}
            </div>

            <section
              style={{
                marginTop: "clamp(60px, 15vh, 100px)",
                borderTop: "1px solid black",
                paddingTop: "clamp(40px, 10vh, 60px)",
                paddingLeft: "clamp(10px, 3vw, 20px)",
                paddingRight: "clamp(10px, 3vw, 20px)"
              }}
            >
              <div
                className="zinc-box"
                style={{
                  backgroundColor: "var(--green-accent)",
                  color: "white",
                  border: "none",
                  padding: "clamp(20px, 5vw, 30px)",
                  marginBottom: "clamp(30px, 8vh, 40px)",
                  borderRadius: "2px"
                }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    fontSize: "clamp(11px, 3vw, 12px)",
                    fontWeight: 700,
                    margin: "0 0 clamp(8px, 2vh, 10px) 0"
                  }}
                >
                  Editorial Note
                </h4>
                <p
                  style={{
                    fontSize: "clamp(12px, 3.5vw, 13px)",
                    fontStyle: "italic",
                    marginTop: "10px",
                    lineHeight: "1.5",
                    margin: 0
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

      {/* Add responsive CSS for mobile optimizations */}
      <style>{`
        @media (max-width: 768px) {
          .body-text {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
          
          .byline {
            font-size: 10px !important;
          }
          
          /* Better touch targets for links */
          a, button {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Improve readability on very small screens */
        @media (max-width: 480px) {
          .body-text {
            font-size: 15px !important;
          }
          
          h1 {
            font-size: 28px !important;
          }
        }
      `}</style>
    </>
  );
};

export default PostDetail;
