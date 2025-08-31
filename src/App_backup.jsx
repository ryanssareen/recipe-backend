import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import NewRecipe from "./NewRecipe";
import Archive from "./Archive";
import Home from "./Home";
import FetchRecipe from "./FetchRecipe"; // AI fetch component

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-indigo-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-purple-700">🍲 Recipe Journal</h1>
        <nav className="space-x-4">
          <Link to="/" className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition">🏠 Home</Link>
          <Link to="/new" className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition">➕ New</Link>
          <Link to="/archive" className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition">📚 Archive</Link>
          <Link to="/fetch" className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition">🤖 AI Fetch</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-white text-center p-4 shadow-inner mt-auto">
        <p className="text-sm text-gray-500">Made with ❤️ on Ryan’s Mac</p>
      </footer>
    </div>
  );
}

// ---------------- App ----------------

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) setRecipes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => setRecipes([recipe, ...recipes]);
  const deleteRecipe = (id) => setRecipes(recipes.filter(r => r.id !== id));
  const startEdit = (id) => {
    const recipe = recipes.find(r => r.id === id);
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const editRecipe = (updatedRecipe) => setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  const cancelEdit = () => setEditingRecipe(null);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/new"
          element={
            <NewRecipe
              addRecipe={addRecipe}
              editRecipe={editRecipe}
              editingRecipe={editingRecipe}
              cancelEdit={cancelEdit}
            />
          }
        />
        <Route
          path="/archive"
          element={<Archive recipes={recipes} startEdit={startEdit} deleteRecipe={deleteRecipe} />}
        />
        <Route
          path="/fetch"
          element={<FetchRecipe addRecipe={addRecipe} />}
        />
      </Routes>
    </Layout>
  );
}
import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-indigo-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-purple-700">🍲 Recipe Journal</h1>
        <nav className="space-x-4">
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/">🏠 Home</Link>
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/new">➕ New</Link>
          <Link className="px-4 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-100 transition" to="/archive">📚 Archive</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

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

function NewRecipe({ addRecipe, editRecipe, editingRecipe, cancelEdit }) {
  const [title, setTitle] = useState(editingRecipe ? editingRecipe.title : "");
  const [ingredients, setIngredients] = useState(editingRecipe ? editingRecipe.ingredients : [""]);
  const [instructions, setInstructions] = useState(editingRecipe ? editingRecipe.instructions : [""]);
  const [date, setDate] = useState(editingRecipe ? editingRecipe.date : "");

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title);
      setIngredients(editingRecipe.ingredients);
      setInstructions(editingRecipe.instructions);
      setDate(editingRecipe.date);
    }
  }, [editingRecipe]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleIngredientPaste = (e, index) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const lines = paste.split(/\r?\n/);
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1, ...lines);
    setIngredients(newIngredients);
  };

  const handleInstructionPaste = (e, index) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const lines = paste.split(/\r?\n/);
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1, ...lines);
    setInstructions(newInstructions);
  };

  const addIngredientLine = () => setIngredients([...ingredients, ""]);
  const addInstructionLine = () => setInstructions([...instructions, ""]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newRecipe = {
      id: editingRecipe ? editingRecipe.id : Date.now(),
      title,
      ingredients,
      instructions,
      date,
    };

    if (editingRecipe) {
      editRecipe(newRecipe);
      cancelEdit();
    } else {
      addRecipe(newRecipe);
    }

    setTitle("");
    setIngredients([""]);
    setInstructions([""]);
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl mx-auto space-y-6 border border-purple-100"
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-4 flex items-center gap-2">
        <FiEdit /> {editingRecipe ? "Edit Recipe" : "Add a New Recipe"}
      </h2>

      <input
        type="text"
        placeholder="Recipe title"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <h3 className="font-bold mb-2">Ingredients</h3>
        {ingredients.map((line, idx) => (
          <input
            key={idx}
            type="text"
            value={line}
            onChange={(e) => handleIngredientChange(idx, e.target.value)}
            onPaste={(e) => handleIngredientPaste(e, idx)}
            className="w-full p-2 border rounded mb-2"
            placeholder={`Ingredient ${idx + 1}`}
          />
        ))}
        <button type="button" onClick={addIngredientLine} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
          + Add Ingredient
        </button>
      </div>

      <div>
        <h3 className="font-bold mb-2 mt-4">Instructions</h3>
        {instructions.map((line, idx) => (
          <input
            key={idx}
            type="text"
            value={line}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
            onPaste={(e) => handleInstructionPaste(e, idx)}
            className="w-full p-2 border rounded mb-2"
            placeholder={`Step ${idx + 1}`}
          />
        ))}
        <button type="button" onClick={addInstructionLine} className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
          + Add Step
        </button>
      </div>

      <input
        type="date"
        className="w-full p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-purple-300 transition"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="flex gap-4">
        <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl shadow-lg hover:bg-purple-700 transition font-semibold text-lg">
          {editingRecipe ? "Save Changes" : "Save Recipe"}
        </button>
        {editingRecipe && (
          <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl shadow-lg hover:bg-gray-400 transition font-semibold text-lg">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Archive({ recipes, startEdit, deleteRecipe }) {
  if (recipes.length === 0) {
    return <p className="text-center text-gray-500 mt-16 text-lg">No recipes yet. Add one from ➕ New.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition border border-purple-100">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">{recipe.title}</h3>
          {recipe.date && <p className="text-sm text-gray-400 flex items-center gap-1"><FiCalendar /> {recipe.date}</p>}

          <p className="mt-4"><strong className="text-purple-600">Ingredients:</strong></p>
          <ul className="list-disc ml-6 mt-1">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <p className="mt-4"><strong className="text-purple-600">Instructions:</strong></p>
          <ol className="list-decimal ml-6 mt-1">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          <div className="flex gap-2 mt-4">
            <button onClick={() => startEdit(recipe.id)} className="flex-1 px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
            <button onClick={() => deleteRecipe(recipe.id)} className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------- App ----------------

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

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

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const startEdit = (id) => {
    const recipe = recipes.find(r => r.id === id);
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editRecipe = (updatedRecipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  const cancelEdit = () => {
    setEditingRecipe(null);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewRecipe addRecipe={addRecipe} editRecipe={editRecipe} editingRecipe={editingRecipe} cancelEdit={cancelEdit} />} />
        <Route path="/archive" element={<Archive recipes={recipes} startEdit={startEdit} deleteRecipe={deleteRecipe} />} />
      </Routes>
    </Layout>
  );
}
