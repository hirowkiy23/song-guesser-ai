import { useState } from "react";

function App() {
  const [lyrics, setLyrics] = useState("");
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictSong = async () => {
    if (!lyrics.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://song-guesser-backend-production.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics }),
      });

      if (!response.ok) throw new Error("Song not found");

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 text-white border border-gray-700">

        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          🎵 Song Guesser AI
        </h1>
        <textarea
          className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          rows="4"
          placeholder="Enter song lyrics..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />

        <button
          onClick={predictSong}
          className="w-full mt-5 bg-green-500 hover:bg-green-600 active:scale-95 transition transform p-2 rounded-xl font-semibold"
        >
          {loading ? "Predicting...": "Predict Song"}
        </button>

        {result && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-400">
              {result}
            </h2>
            <p className="text-gray-400 mt-1">
              Confidence: {confidence}%
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-6 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );

}

export default App;