const About = () => {
  return (
    <div
      className="user-manager"
      style={{
        margin: "0 auto",
        maxWidth: "900px",
        padding: "0 16px", // Added horizontal padding for mobile
      }}
    >
      <header
        style={{
          margin: "30px 0px",
          borderBottom: "var(--border-double)",
          paddingBottom: "20px",
        }}
      >
        <h2 
          className="h-large" 
          style={{ 
            margin: 0,
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)", // Responsive font size
          }}
        >
          OUR MISSION
        </h2>
        <p
          style={{
            fontSize: "clamp(10px, 3vw, 11px)", // Responsive font size
            fontFamily: "var(--font-sans)",
            color: "#666",
            marginTop: "5px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Founded 2024 • Student-Led Publication
        </p>
      </header>

      <div className="grid-system">
        <div style={{ gridColumn: "span 12" }}>
          <p
            style={{
              lineHeight: "1.6",
              marginBottom: "30px",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 4vw, 1.1rem)", // Responsive font size
            }}
          >
            The Andinet Gazette is a student-led publication dedicated to
            providing accurate, timely, and relevant news to our school
            community. Founded in 2024, our mission is to foster transparency,
            encourage critical thinking, and provide a platform for student
            voices.
          </p>

          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "clamp(13px, 4vw, 14px)", // Responsive font size
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "15px",
                borderBottom: "1px solid var(--silver-accent)",
                paddingBottom: "8px",
              }}
            >
              THE EDITORIAL BOARD
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { role: "Editor-in-Chief:", name: "Gelile Alemayehu" },
                { role: "Treasurer:", name: "Nahom Natnael" },
                { role: "Public Relations (PR):", name: "Esrom Anagaw & Hasset Kibret" },
                { role: "Secretary:", name: "Elbetel Melese" },
                { role: "Graphics Designer:", name: "Nathanel Yohannes" },
              ].map((member, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    flexDirection: "column", // Stack on mobile
                    gap: "4px", // Space between label and name on mobile
                    borderBottom: "1px dotted #eee",
                    paddingBottom: "8px",
                  }}
                >
                  <strong style={{ fontFamily: "var(--font-sans)" }}>
                    {member.role}
                  </strong>
                  <span style={{ color: "#666" }}>{member.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: "40px",
              padding: "clamp(16px, 4vw, 20px)", // Responsive padding
              backgroundColor: "#f9f9f9",
              borderLeft: "3px solid #1a1a1a",
              fontStyle: "italic",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(11px, 3vw, 12px)", // Responsive font size
                fontFamily: "var(--font-sans)",
                lineHeight: "1.5", // Better line height for mobile
              }}
            >
              Interested in joining the staff? Sign up for an account and
              contact an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
