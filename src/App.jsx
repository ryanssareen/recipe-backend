import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiCalendar, FiList, FiEdit } from "react-icons/fi";

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-purple-700">🍲 Recipe Journal</h1>
        <nav className="space-x-4">
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/">🏠 Home</Link>
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/new">➕ New</Link>
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/archive">📚 Archive</Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white text-center p-4 shadow-inner mt-auto">
        <p className="text-sm text-gray-500">Made with ❤️ on Ryan’s Mac</p>
      </footer>
    </div>
  );
}

// ---------------- Pages ----------------

function Home() {
  return (
    <div className="text-center mt-16">
      <h2 className="text-4xl font-bold text-purple-700 mb-6 animate-pulse">Welcome to Recipe Journal!</h2>
      <p className="text-lg text-gray-700 max-w-xl mx-auto">Save your favorite recipes and browse them in the Archive. Add a new recipe and see your collection come alive!</p>
      <div className="mt-10 flex justify-center gap-4">
        <Link to="/new" className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition">Add a Recipe</Link>
        <Link to="/archive" className="bg-white border border-purple-600 text-purple-600 px-6 py-3 rounded-xl shadow hover:bg-purple-50 transition">View Archive</Link>
      </div>
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

    setTitle("");
    setIngredients("");
    setInstructions("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl mx-auto space-y-6 border border-purple-100"
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center gap-2"><FiEdit /> Add a New Recipe</h2>

      <input
        type="text"
        placeholder="Recipe title"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Ingredients"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        rows="4"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <textarea
        placeholder="Instructions"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        rows="6"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="w-full bg-purple-600 text-white py-3 rounded-xl shadow-lg hover:bg-purple-700 transition font-semibold text-lg">
        Save Recipe
      </button>
    </form>
  );
}

function Archive({ recipes }) {
  if (recipes.length === 0) {
    return <p className="text-center text-gray-500 mt-16 text-lg">No recipes yet. Add one from ➕ New.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition border border-purple-100">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">{recipe.title}</h3>
          {recipe.date && <p className="text-sm text-gray-400 flex items-center gap-1"><FiCalendar /> {recipe.date}</p>}
          <p className="mt-4"><strong className="text-purple-600">Ingredients:</strong> {recipe.ingredients}</p>
          <p className="mt-2"><strong className="text-purple-600">Instructions:</strong> {recipe.instructions}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------- App ----------------

export default function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      setRecipes(JSON.parse(saved));
    }
  }, []);

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