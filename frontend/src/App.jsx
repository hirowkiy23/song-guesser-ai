import { useState } from "react";

function App() {
  const [lyrics, setLyrics] = useState("");
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictSong = async () => {
    setError(null);
    setResult(null);
    setConfidence(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lyrics }),
      });

      if (!response.ok) {
        throw new Error("Song not found");
      }

      const data = await response.json();
      setResult(data.data.predicted_song);
      setConfidence((data.data.confidence * 100).toFixed(1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#121212",
      color: "white",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "#1e1e1e",
        padding: "40px",
        borderRadius: "10px",
        width: "400px",
        textAlign: "center"
      }}>
        <h1>🎵 Song Guesser AI</h1>

        <textarea
          rows="4"
          style={{ width: "100%", padding: "10px" }}
          placeholder="Enter song lyrics..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />

        <br /><br />

        <button
          onClick={predictSong}
          style={{
            padding: "10px 20px",
            background: "#1DB954",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          {loading ? "Predicting..." : "Predict Song"}
        </button>

        <br /><br />

        {result && (
          <div>
            <h2>{result}</h2>
            <p>Confidence: {confidence}%</p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;