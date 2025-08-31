import { useState } from "react";

export default function NewRecipe({ addRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients: ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
      instructions: instructions
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      date,
    };

    addRecipe(newRecipe);

    // reset form
    setTitle("");
    setIngredients("");
    setInstructions("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold">➕ Add a New Recipe</h2>

      <input
        type="text"
        placeholder="Recipe title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Ingredients (one per line)"
        className="w-full p-2 border rounded"
        rows="3"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <textarea
        placeholder="Instructions (one step per line)"
        className="w-full p-2 border rounded"
        rows="5"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 border rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">
        Save Recipe
      </button>
    </form>
  );
}

