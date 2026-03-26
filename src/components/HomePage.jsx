// src/components/HomePage.jsx - Complete fixed version
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, getDocs, limit, startAfter } from "firebase/firestore";
import { Link } from "react-router-dom";
import Skeleton from "./common/Skeleton";
import Pagination from './common/Pagination';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const POSTS_PER_PAGE = 12;
  
  // API states
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Loading...",
  });
  const [finance, setFinance] = useState({
    value: "0",
    change: "0",
    changePercent: "0",
  });

  // Fetch Weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=9.03&longitude=38.74&current_weather=true&units=metric"
        );
        const data = await response.json();

        if (data.current_weather) {
          const tempC = Math.round(data.current_weather.temperature);
          const weatherCode = data.current_weather.weathercode;
          
          const conditions = {
            0: "Clear Sky ☀️",
            1: "Mainly Clear 🌤️",
            2: "Partly Cloudy ⛅",
            3: "Overcast ☁️",
            45: "Foggy 🌫️",
            48: "Foggy 🌫️",
            51: "Light Drizzle 🌧️",
            53: "Drizzle 🌧️",
            55: "Heavy Drizzle 🌧️",
            61: "Light Rain 🌧️",
            63: "Rain 🌧️",
            65: "Heavy Rain 🌧️",
            71: "Light Snow 🌨️",
            73: "Snow 🌨️",
            75: "Heavy Snow 🌨️",
            80: "Light Showers ☔",
            81: "Showers ☔",
            82: "Heavy Showers ☔",
            95: "Thunderstorm ⛈️",
          };
          
          const condition = conditions[weatherCode] || "Mixed Conditions";
          
          setWeather({
            temp: `${tempC}°C`,
            condition: condition,
          });
        }
      } catch (error) {
        setWeather({ temp: "--", condition: "Unavailable" });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Finance
  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
        
        const cached = localStorage.getItem("sp500_data");
        const cachedTime = localStorage.getItem("sp500_time");
        const now = Date.now();

        if (cached && cachedTime && now - parseInt(cachedTime) < 600000) {
          const cachedData = JSON.parse(cached);
          setFinance(cachedData);
          return;
        }

        if (!API_KEY) {
          throw new Error("No API key");
        }

        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (
          data["Global Quote"] &&
          Object.keys(data["Global Quote"]).length > 0
        ) {
          const price = parseFloat(data["Global Quote"]["05. price"]).toFixed(2);
          const change = parseFloat(data["Global Quote"]["09. change"]).toFixed(2);
          let changePercent = data["Global Quote"]["10. change percent"];
          changePercent = changePercent.replace("%", "");

          const financeData = {
            value: price,
            change: change,
            changePercent: changePercent,
          };

          setFinance(financeData);
          
          localStorage.setItem("sp500_data", JSON.stringify(financeData));
          localStorage.setItem("sp500_time", now.toString());
        } else if (data.Note && cached) {
          const cachedData = JSON.parse(cached);
          setFinance(cachedData);
        }
      } catch (error) {
        const cached = localStorage.getItem("sp500_data");
        if (cached) {
          setFinance(JSON.parse(cached));
        }
      }
    };

    fetchFinance();
    const interval = setInterval(fetchFinance, 900000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Posts with Pagination
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let q;
        
        if (currentPage === 1) {
          q = query(
            collection(db, "posts"),
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(POSTS_PER_PAGE)
          );
        } else {
          if (!lastVisible) {
            const firstPageQuery = query(
              collection(db, "posts"),
              where("status", "==", "published"),
              orderBy("createdAt", "desc"),
              limit(POSTS_PER_PAGE * (currentPage - 1))
            );
            const firstPageSnapshot = await getDocs(firstPageQuery);
            const lastDocFromPrev = firstPageSnapshot.docs[firstPageSnapshot.docs.length - 1];
            
            q = query(
              collection(db, "posts"),
              where("status", "==", "published"),
              orderBy("createdAt", "desc"),
              startAfter(lastDocFromPrev),
              limit(POSTS_PER_PAGE)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("status", "==", "published"),
              orderBy("createdAt", "desc"),
              startAfter(lastVisible),
              limit(POSTS_PER_PAGE)
            );
          }
        }
        
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        
        if (querySnapshot.docs.length === POSTS_PER_PAGE) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          setLastVisible(null);
        }
        
        const totalQuery = query(collection(db, "posts"), where("status", "==", "published"));
        const totalSnapshot = await getDocs(totalQuery);
        const totalCount = totalSnapshot.size;
        setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
        
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage]);

  // Search filter
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category &&
          post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Skeleton width="60%" height="80px" margin="0 auto" />
          <Skeleton width="100%" height="40px" margin="20px auto" />
        </div>
        <div className="grid-system tier-1">
          <div className="column-border" style={{ gridColumn: 'span 8' }}>
            <Skeleton width="30%" height="15px" />
            <Skeleton width="90%" height="120px" margin="20px 0" />
            <Skeleton height="400px" margin="30px 0" />
            <Skeleton count={3} />
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: 'var(--hairline)' }}>
                <Skeleton width="40%" height="15px" />
                <Skeleton height="60px" margin="15px 0" />
                <Skeleton height="80px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const leadStory = filteredPosts[0];
  const secondaryStories = filteredPosts.slice(1, 4);
  const featureStories = filteredPosts.slice(4, 7);
  const latestUpdates = filteredPosts.slice(7, 13);

  const changePercentNum = parseFloat(finance.changePercent);
  const financeColor = !isNaN(changePercentNum) && changePercentNum > 0 
    ? "#2e7d32" 
    : !isNaN(changePercentNum) && changePercentNum < 0 
      ? "#d32f2f" 
      : "#666";
  
  const displayPercent = !isNaN(changePercentNum) && changePercentNum !== 0
    ? `${changePercentNum > 0 ? '+' : ''}${finance.changePercent}%`
    : "0.00%";

  return (
    <div className="container">
      <header className="site-header">
        <Link to="/" className="masthead-title">
          The Andinet
        </Link>
        <div className="masthead-nav-bar">
          <div style={{ textAlign: "left" }}>
            {weather.temp} <span style={{ fontWeight: 400 }}>{weather.condition}</span>
          </div>
          <div style={{ fontSize: "14px" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div style={{ textAlign: "right" }}>
            S&P 500 <span style={{ color: financeColor, fontWeight: 500 }}>
              {displayPercent}
            </span>
          </div>
        </div>
      </header>

      <section className="master-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search the archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <main style={{ marginTop: '50px' }}>
        {/* Tier 1: Lead Story & Secondary */}
        <div className="grid-system tier-1 homepage-grid">
          <div className="lead-story-col column-border">
            {leadStory && (
              <article>
                <span className="kicker">{leadStory.category || "News"}</span>
                <Link to={`/post/${leadStory.id}`} className="headline h-giant">
                  {leadStory.title}
                </Link>
                <div className="media-frame">
                  {leadStory.imageUrl && (
                    <img 
                      src={leadStory.imageUrl} 
                      alt="Lead" 
                      loading="lazy"
                      width="100%"
                      height="auto"
                    />
                  )}
                </div>
                <p className="excerpt" style={{ fontSize: "1.1rem" }}>
                  {leadStory.excerpt}
                </p>
                <div className="byline">By {leadStory.authorName}</div>
              </article>
            )}
          </div>
          <div className="secondary-col">
            {secondaryStories.map((post, idx) => (
              <article
                key={post.id}
                style={{
                  marginBottom: "30px",
                  paddingBottom: "20px",
                  borderBottom: idx !== secondaryStories.length - 1 ? "var(--hairline)" : "none",
                }}
              >
                <span className="kicker">{post.category || "News"}</span>
                <Link to={`/post/${post.id}`} className="headline h-large">
                  {post.title}
                </Link>
                <p className="excerpt" style={{ fontSize: "0.9rem" }}>
                  {post.excerpt?.substring(0, 120)}...
                </p>
                <div className="byline">By {post.authorName}</div>
              </article>
            ))}
          </div>
        </div>

        {/* Tier 2: Features */}
        <div className="grid-system tier-2 homepage-grid">
          {featureStories.map((post) => (
            <div key={post.id} className="feature-col column-border">
              <article>
                <span className="kicker">{post.category || "Feature"}</span>
                <Link to={`/post/${post.id}`} className="headline h-medium">
                  {post.title}
                </Link>
                <div className="media-frame" style={{ border: 'none', padding: 0 }}>
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="Feature" 
                      style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                      loading="lazy"
                      width="100%"
                      height="200"
                    />
                  )}
                </div>
                <p className="excerpt" style={{ fontSize: "0.85rem" }}>
                  {post.excerpt?.substring(0, 100)}...
                </p>
                <div className="byline">By {post.authorName}</div>
              </article>
            </div>
          ))}
        </div>

        {/* Tier 3: Latest Updates */}
        <div className="grid-system tier-3 homepage-grid">
          {latestUpdates.map((post) => (
            <div key={post.id} className="latest-col">
              <article style={{ borderTop: '1px solid black', paddingTop: '10px' }}>
                <Link to={`/post/${post.id}`} className="headline h-small">
                  {post.title}
                </Link>
                <div className="byline" style={{ fontSize: '9px', marginTop: '5px' }}>
                  {post.authorName} • {post.category || "News"}
                </div>
              </article>
            </div>
          ))}
        </div>
        
        {filteredPosts.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {filteredPosts.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "50px", fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>
            No records found in the archives.
          </p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
