import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-indigo-200">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍲 Recipe Journal</h1>
        <nav className="space-x-4">
          <Link to="/" className="px-3 py-1 rounded hover:bg-gray-200">🏠 Home</Link>
          <Link to="/new" className="px-3 py-1 rounded hover:bg-gray-200">➕ New</Link>
          <Link to="/archive" className="px-3 py-1 rounded hover:bg-gray-200">📚 Archive</Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white text-center p-4 shadow mt-auto">
        <p className="text-sm text-gray-600">Made with ❤️ on Ryan’s Mac</p>
      </footer>
    </div>
  );
}

// ---------------- Pages ----------------

function Home() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">Welcome to Recipe Journal!</h2>
      <p className="text-lg text-gray-700">
        Save your favorite recipes and browse them in the Archive.
      </p>
    </div>
  );
}

function NewRecipe({ addRecipe }) {
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
      ingredients,
      instructions,
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
        placeholder="Ingredients"
        className="w-full p-2 border rounded"
        rows="3"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <textarea
        placeholder="Instructions"
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

function Archive({ recipes }) {
  if (recipes.length === 0) {
    return <p className="text-center text-gray-600">No recipes yet. Add one from ➕ New.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold">{recipe.title}</h3>
          {recipe.date && <p className="text-sm text-gray-500">📅 {recipe.date}</p>}
          <p className="mt-2"><strong>Ingredients:</strong> {recipe.ingredients}</p>
          <p className="mt-2"><strong>Instructions:</strong> {recipe.instructions}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------- App ----------------

export default function App() {
  const [recipes, setRecipes] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      setRecipes(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => {
    setRecipes([recipe, ...recipes]);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewRecipe addRecipe={addRecipe} />} />
        <Route path="/archive" element={<Archive recipes={recipes} />} />
      </Routes>
    </Layout>
  );
}