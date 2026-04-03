import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PuzzlesPage = () => {
  const [wordle, setWordle] = useState({
    solution: "",
    guesses: [],
    currentGuess: "",
    gameOver: false,
    won: false,
    message: "",
    keyboardLetters: {}
  });

  // Expanded Wordle word list (500+ common 5-letter words)
  const wordleWords = [
    "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
    "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
    "ALONG", "ALTER", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
    "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AVOID", "AWARD", "AWARE", "BADLY", "BAKER",
    "BASES", "BASIC", "BEACH", "BEGAN", "BEING", "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK",
    "BLAME", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND",
    "BRAVE", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BUILD",
    "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHAOS",
    "CHARM", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA", "CHOSE",
    "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLIMB", "CLOCK", "CLOSE", "CLOUD",
    "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRASH", "CRAZY", "CREAM",
    "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CURVE", "CYCLE", "DAILY", "DANCE", "DATED",
    "DEALT", "DEATH", "DEBUT", "DELAY", "DELTA", "DENSE", "DEPOT", "DEPTH", "DERBY", "DIGIT",
    "DIRTY", "DOZEN", "DRAFT", "DRAMA", "DRANK", "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK",
    "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "EITHER", "ELECT", "ELITE",
    "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT",
    "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FENCE", "FIBER", "FIELD", "FIFTH", "FIFTY",
    "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE",
    "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT",
    "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND",
    "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS",
    "GUEST", "GUIDE", "GUILT", "HAPPY", "HARRY", "HEART", "HEAVY", "HENCE", "HENRY", "HORSE",
    "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "IMPLY", "INDEX", "INNER", "INPUT", "ISSUE",
    "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER",
    "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEMON", "LEVEL", "LEWIS",
    "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY", "LUNCH",
    "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR", "MEANT",
    "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL",
    "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVED", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY",
    "NIGHT", "NOISE", "NORTH", "NOTED", "NUMBER", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER",
    "OTHER", "OUGHT", "OUTER", "OWNED", "OWNER", "PAINT", "PANEL", "PAPER", "PARIS", "PARTY",
    "PEACE", "PENNY", "PETER", "PHASE", "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PITCH",
    "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "PLAZA", "POINT", "POUND", "POWER", "PRESS",
    "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "QUEEN",
    "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO", "REACH", "READY",
    "REALM", "REFER", "RELAX", "REPLY", "RIDER", "RIDGE", "RIFLE", "RIGHT", "RIGID", "RIVER",
    "ROBIN", "ROCKY", "ROGER", "ROMAN", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE",
    "SCENE", "SCOPE", "SCORE", "SCREW", "SENSE", "SERVE", "SEVEN", "SHALL", "SHAPE", "SHARE",
    "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORE",
    "SHORT", "SHOWN", "SIGHT", "SILLY", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLASH",
    "SLEEP", "SLIDE", "SLING", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SNAKE", "SOLID",
    "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT",
    "SPLIT", "SPOKE", "SPORT", "SQUAD", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE",
    "STEAM", "STEEL", "STEEP", "STEER", "STICK", "STILL", "STOCK", "STONE", "STOOD", "STORE",
    "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUNNY",
    "SUPER", "SURGE", "SWEET", "SWIFT", "SWING", "SWORD", "TABLE", "TAKEN", "TASTE", "TAXES",
    "TEACH", "TEAMS", "TEETH", "TEMPO", "TERRY", "TEXAS", "THANK", "THEFT", "THEIR", "THEME",
    "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW",
    "THUMB", "TIGHT", "TIMER", "TITLE", "TODAY", "TOMMY", "TOPIC", "TOTAL", "TOUCH", "TOUGH",
    "TOWER", "TRACK", "TRADE", "TRAIL", "TRAIN", "TRASH", "TREAT", "TREND", "TRIAL", "TRIBE",
    "TRICK", "TROOP", "TROUT", "TRUCK", "TRULY", "TRUMP", "TRUST", "TRUTH", "TWICE", "TWINS",
    "UNCLE", "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE",
    "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOCAL", "VOICE", "WAGON",
    "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE",
    "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WRITE",
    "WRONG", "WROTE", "YIELD", "YOUNG", "YOURS", "YOUTH", "ZEBRA", "ZONES"
  ];

  // Get today's word (consistent across page reloads)
  const getTodaysWord = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedWord = localStorage.getItem(`wordle_solution_${today}`);
    
    if (storedWord) {
      return storedWord;
    } else {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const wordIndex = dayOfYear % wordleWords.length;
      const word = wordleWords[wordIndex];
      localStorage.setItem(`wordle_solution_${today}`, word);
      return word;
    }
  };

  // Initialize or reset game
  const initializeGame = (keepSolution = false) => {
    const solution = keepSolution ? wordle.solution : getTodaysWord();
    
    // Check if there's saved game progress for today
    const today = new Date().toISOString().split('T')[0];
    const savedGame = localStorage.getItem(`wordle_game_${today}`);
    
    if (savedGame && !keepSolution) {
      const parsed = JSON.parse(savedGame);
      setWordle({
        solution: parsed.solution,
        guesses: parsed.guesses,
        currentGuess: "",
        gameOver: parsed.gameOver,
        won: parsed.won,
        message: parsed.gameOver ? (parsed.won ? "🎉 You won! 🎉" : `😔 The word was ${parsed.solution}`) : "",
        keyboardLetters: parsed.keyboardLetters || {}
      });
    } else {
      setWordle({
        solution: solution,
        guesses: [],
        currentGuess: "",
        gameOver: false,
        won: false,
        message: "",
        keyboardLetters: {}
      });
    }
  };

  // Save game state to localStorage
  const saveGameState = (gameState) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`wordle_game_${today}`, JSON.stringify({
      solution: gameState.solution,
      guesses: gameState.guesses,
      gameOver: gameState.gameOver,
      won: gameState.won,
      keyboardLetters: gameState.keyboardLetters
    }));
  };

  // Start new game (reset everything for a new word)
  const startNewGame = () => {
    // Clear saved game for today
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`wordle_game_${today}`);
    
    // Get a new random word (different from today's)
    const randomIndex = Math.floor(Math.random() * wordleWords.length);
    const newWord = wordleWords[randomIndex];
    
    // Reset all state
    setWordle({
      solution: newWord,
      guesses: [],
      currentGuess: "",
      gameOver: false,
      won: false,
      message: "",
      keyboardLetters: {}
    });
  };

  // Load game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (wordle.solution && !wordle.message.includes("The word was")) {
      saveGameState(wordle);
    }
  }, [wordle.guesses, wordle.gameOver, wordle.won, wordle.keyboardLetters]);

  const getLetterColor = (letter, index, guess) => {
    if (guess[index] === wordle.solution[index]) return "correct";
    if (wordle.solution.includes(guess[index])) return "present";
    return "absent";
  };

  const handleWordleKeyPress = (e) => {
    if (wordle.gameOver) return;
    
    if (e.key === "Enter") {
      if (wordle.currentGuess.length !== 5) {
        setWordle(prev => ({ ...prev, message: "Word must be 5 letters" }));
        setTimeout(() => setWordle(prev => ({ ...prev, message: "" })), 1500);
        return;
      }
      
      if (!wordleWords.includes(wordle.currentGuess)) {
        setWordle(prev => ({ ...prev, message: "Not a valid word" }));
        setTimeout(() => setWordle(prev => ({ ...prev, message: "" })), 1500);
        return;
      }
      
      const newGuesses = [...wordle.guesses, wordle.currentGuess];
      const won = wordle.currentGuess === wordle.solution;
      const gameOver = won || newGuesses.length === 6;
      
      // Update keyboard letter colors
      const newKeyboardLetters = { ...wordle.keyboardLetters };
      for (let i = 0; i < wordle.currentGuess.length; i++) {
        const letter = wordle.currentGuess[i];
        const status = getLetterColor(letter, i, wordle.currentGuess);
        if (!newKeyboardLetters[letter] || 
            (status === "correct") ||
            (status === "present" && newKeyboardLetters[letter] !== "correct")) {
          newKeyboardLetters[letter] = status;
        }
      }
      
      setWordle(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: "",
        gameOver,
        won,
        keyboardLetters: newKeyboardLetters,
        message: gameOver ? (won ? "🎉 You won! 🎉" : `😔 The word was ${prev.solution}`) : ""
      }));
    } else if (e.key === "Backspace") {
      setWordle(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));
    } else if (/^[A-Za-z]$/.test(e.key) && wordle.currentGuess.length < 5) {
      setWordle(prev => ({
        ...prev,
        currentGuess: (prev.currentGuess + e.key.toUpperCase()).slice(0, 5)
      }));
    }
  };

  const handleVirtualKeyboard = (letter) => {
    if (wordle.gameOver) return;
    if (letter === "ENTER") {
      handleWordleKeyPress({ key: "Enter" });
    } else if (letter === "BACKSPACE") {
      handleWordleKeyPress({ key: "Backspace" });
    } else if (wordle.currentGuess.length < 5) {
      setWordle(prev => ({
        ...prev,
        currentGuess: (prev.currentGuess + letter).slice(0, 5)
      }));
    }
  };

  return (
    <div className="puzzles-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .puzzles-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        
        .site-header {
          margin-bottom: 40px;
        }
        
        .masthead-title {
          display: block;
          text-decoration: none;
          color: #000;
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          padding: 1.5rem;
          background-color: #c7b385;
          margin-bottom: 20px;
        }
        
        .masthead-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          font-size: 0.9rem;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .back-link {
          text-align: right;
          color: inherit;
          text-decoration: none;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
        
        .wordle-container {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        
        .puzzle-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 30px;
          font-family: 'Georgia', serif;
        }
        
        .wordle-grid {
          margin-bottom: 30px;
        }
        
        .wordle-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .wordle-cell {
          width: 60px;
          height: 60px;
          border: 2px solid #d3d3d3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          font-family: 'Arial', sans-serif;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        
        .wordle-cell.correct {
          background-color: #6aaa64;
          color: white;
          border-color: #6aaa64;
          animation: flip 0.5s ease;
        }
        
        .wordle-cell.present {
          background-color: #c9b458;
          color: white;
          border-color: #c9b458;
          animation: flip 0.5s ease;
        }
        
        .wordle-cell.absent {
          background-color: #787c7e;
          color: white;
          border-color: #787c7e;
          animation: flip 0.5s ease;
        }
        
        @keyframes flip {
          0% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0);
          }
          100% {
            transform: scaleY(1);
          }
        }
        
        .virtual-keyboard {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin: 20px 0;
          max-width: 500px;
          margin: 20px auto;
        }
        
        .keyboard-key {
          padding: 12px 8px;
          min-width: 35px;
          background: #d3d3d3;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.9rem;
          transition: all 0.1s;
          font-family: 'Arial', sans-serif;
        }
        
        .keyboard-key:hover {
          background: #bdbdbd;
        }
        
        .keyboard-key:active {
          transform: scale(0.95);
        }
        
        .enter-key, .backspace-key {
          background: #c7b385;
          min-width: 55px;
        }
        
        .key-correct {
          background: #6aaa64;
          color: white;
        }
        
        .key-present {
          background: #c9b458;
          color: white;
        }
        
        .key-absent {
          background: #787c7e;
          color: white;
        }
        
        .wordle-message {
          margin-top: 20px;
          padding: 10px;
          background: #f0f0f0;
          font-size: 1.1rem;
          border-radius: 4px;
        }
        
        .new-game-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #c7b385;
          border: none;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: 1rem;
          transition: all 0.2s;
        }
        
        .new-game-btn:hover {
          background-color: #b8a46b;
          transform: translateY(-1px);
        }
        
        .new-game-btn:active {
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .puzzles-container {
            padding: 10px;
          }
          
          .masthead-title {
            font-size: 1.8rem;
            padding: 1rem;
          }
          
          .wordle-cell {
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
          }
          
          .keyboard-key {
            padding: 8px 6px;
            min-width: 28px;
            font-size: 0.8rem;
          }
          
          .enter-key, .backspace-key {
            min-width: 45px;
          }
        }
        
        @media (max-width: 480px) {
          .wordle-cell {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }
          
          .wordle-row {
            gap: 6px;
          }
          
          .keyboard-key {
            padding: 8px 5px;
            min-width: 32px;
            font-size: 0.75rem;
          }
          
          .enter-key, .backspace-key {
            min-width: 50px;
          }
        }
      `}</style>
      
      <header className="site-header">
        <Link to="/" className="masthead-title">
          The Andinet
        </Link>
        <div className="masthead-nav-bar">
          <div>Wordle Puzzle</div>
          <div>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <Link to="/" className="back-link">
            ← Back to News
          </Link>
        </div>
      </header>

      <main>
        <div className="wordle-container">
          <h2 className="puzzle-title">Wordle</h2>
          
          {/* Wordle Grid */}
          <div className="wordle-grid">
            {[0, 1, 2, 3, 4, 5].map(row => (
              <div key={row} className="wordle-row">
                {[0, 1, 2, 3, 4].map(col => {
                  const guess = wordle.guesses[row];
                  const letter = guess ? guess[col] : (row === wordle.guesses.length ? wordle.currentGuess[col] : "");
                  const colorClass = guess ? getLetterColor(letter, col, guess) : "";
                  
                  return (
                    <div key={col} className={`wordle-cell ${colorClass}`}>
                      {letter || ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Virtual Keyboard for Mobile */}
          <div className="virtual-keyboard">
            {["Q","W","E","R","T","Y","U","I","O","P","BACKSPACE","A","S","D","F","G","H","J","K","L","ENTER","Z","X","C","V","B","N","M"].map(key => (
              <button
                key={key}
                onClick={() => handleVirtualKeyboard(key)}
                className={`keyboard-key ${key === "ENTER" ? "enter-key" : key === "BACKSPACE" ? "backspace-key" : ""} ${wordle.keyboardLetters[key] ? `key-${wordle.keyboardLetters[key]}` : ""}`}
                disabled={wordle.gameOver}
              >
                {key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "↵" : key}
              </button>
            ))}
          </div>
          
          {wordle.message && (
            <div className="wordle-message">
              {wordle.message}
            </div>
          )}
          
          <button onClick={startNewGame} className="new-game-btn">
            New Game
          </button>
          
          <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
            Press Enter to submit • Type or use keyboard
          </p>
        </div>
      </main>
    </div>
  );
};

export default PuzzlesPage;
