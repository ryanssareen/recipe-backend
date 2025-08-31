


import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import NewRecipe from "./NewRecipe";
import Archive from "./Archive";
import FetchRecipe from "./FetchRecipe";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-indigo-200">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍲 Recipe Journal</h1>
        <nav className="space-x-4">
          <Link to="/" className="px-3 py-1 rounded hover:bg-gray-200">🏠 Home</Link>
          <Link to="/new" className="px-3 py-1 rounded hover:bg-gray-200">➕ New</Link>
          <Link to="/archive" className="px-3 py-1 rounded hover:bg-gray-200">📚 Archive</Link>
          <Link to="/fetch" className="px-3 py-1 rounded hover:bg-gray-200">🤖 Fetch AI</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-white text-center p-4 shadow mt-auto">
        <p className="text-sm text-gray-600">Made with ❤️ on Ryan’s Mac</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing recipes:", err);
      }
    }
  }, []);

  // Save to localStorage on every update
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => setRecipes([recipe, ...recipes]);
  const startEdit = (recipe) => console.log("TODO edit", recipe);
  const deleteRecipe = (id) => setRecipes(recipes.filter((r) => r.id !== id));

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewRecipe addRecipe={addRecipe} />} />
        <Route path="/archive" element={
          <Archive recipes={recipes} startEdit={startEdit} deleteRecipe={deleteRecipe} />
        }/>
        <Route path="/fetch" element={<FetchRecipe addRecipe={addRecipe} />} />
      </Routes>
    </Layout>
  );
}

