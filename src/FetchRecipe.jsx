import { useState } from "react";

export default function FetchRecipe({ addRecipe }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedRecipe, setFetchedRecipe] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchRecipe = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/recipes?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      // Normalize ingredients + instructions
      setFetchedRecipe({
        title: data.title || query,
        ingredients: Array.isArray(data.ingredients)
          ? data.ingredients
          : data.ingredients?.split("\n").filter(Boolean) || [],
        instructions: Array.isArray(data.instructions)
          ? data.instructions
          : data.instructions?.split("\n").filter(Boolean) || [],
        date: new Date().toLocaleDateString(),
      });
    } catch (err) {
      console.error("❌ Failed to fetch recipe:", err);
      alert("Failed to fetch recipe. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = () => {
    if (!fetchedRecipe) return;
    addRecipe(fetchedRecipe);
    setFetchedRecipe(null);
    setQuery("");
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-purple-700">
        Fetch Recipe with AI (Google Gemini)
      </h2>

      {/* Search box */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Rajma Chawal"
        className="w-full p-2 border rounded"
      />

      {/* Fetch button */}
      <button
        onClick={fetchRecipe}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        {loading ? "Fetching..." : "Fetch Recipe"}
      </button>

      {/* Show fetched recipe */}
      {fetchedRecipe && (
        <div className="mt-4 border border-purple-200 p-4 rounded space-y-2">
          <h3 className="text-xl font-bold">{fetchedRecipe.title}</h3>

          <p><strong>Ingredients:</strong></p>
          <ul className="list-disc ml-6">
            {fetchedRecipe.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal ml-6">
            {fetchedRecipe.instructions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>

          <p><strong>Date:</strong> {fetchedRecipe.date}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={saveRecipe}
              className="bg-green-500 px-3 py-1 text-white rounded hover:bg-green-600"
            >
              Add to Archive
            </button>

            <button
              onClick={() => setFetchedRecipe(null)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

