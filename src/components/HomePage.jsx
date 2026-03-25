import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category &&
          post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  if (loading)
    return (
      <div
        className="container"
        style={{
          textAlign: "center",
          padding: "150px",
          fontFamily: "Playfair Display",
        }}
      >
        SYNCHRONIZING WITH PRESS...
      </div>
    );

  const leadStory = filteredPosts[0];
  const secondColumn = filteredPosts.slice(1, 4);
  const thirdColumn = filteredPosts.slice(4, 10);

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
          The Andinet Gazette
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
        <input
          type="text"
          placeholder="Explore the Archives"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <main className="front-page-grid">
        {/* Lead Column */}
        <section className="column">
          {leadStory && (
            <article>
              <span className="kicker">{leadStory.category || "News"}</span>
              <Link to={`/post/${leadStory.id}`} className="headline h-giant">
                {leadStory.title}
              </Link>
              <div className="media-frame">
                {leadStory.imageUrl && (
                  <img src={leadStory.imageUrl} alt="Lead" />
                )}
              </div>
              <p className="excerpt" style={{ fontSize: "1.1rem" }}>
                {leadStory.excerpt}
              </p>
              <div className="byline">By {leadStory.authorName}</div>
            </article>
          )}
        </section>

        {/* Second Column */}
        <section className="column">
          {secondColumn.map((post, idx) => (
            <article
              key={post.id}
              style={{
                marginBottom: "40px",
                paddingBottom: "30px",
                borderBottom:
                  idx !== secondColumn.length - 1 ? "var(--hairline)" : "none",
              }}
            >
              <span className="kicker">{post.category || "News"}</span>
              <Link to={`/post/${post.id}`} className="headline h-large">
                {post.title}
              </Link>
              <p className="excerpt" style={{ fontSize: "0.9rem" }}>
                {post.excerpt?.substring(0, 150)}...
              </p>
              <div className="byline">By {post.authorName}</div>
            </article>
          ))}
        </section>

        {/* Third Column */}
        <section className="column">
          <h4
            className="kicker"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "25px",
              borderBottom: "1px solid black",
            }}
          >
            Latest Updates
          </h4>
          {thirdColumn.map((post) => (
            <article
              key={post.id}
              style={{
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "var(--hairline)",
              }}
            >
              <Link to={`/post/${post.id}`} className="headline h-small">
                {post.title}
              </Link>
              <div
                className="byline"
                style={{ fontSize: "9px", marginTop: "5px" }}
              >
                {post.authorName} • {post.category || "News"}
              </div>
            </article>
          ))}
          {filteredPosts.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              No records found.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
