import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Archive({ recipes, startEdit, deleteRecipe }) {
  const navigate = useNavigate();

  if (!recipes || recipes.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No recipes yet. Add one from ➕ New or fetch with AI.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-4 rounded-xl shadow space-y-2">
          <h3 className="text-xl font-bold">{recipe.title}</h3>

          {recipe.date && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiCalendar /> {recipe.date}
            </p>
          )}

          <div>
            <strong>Ingredients:</strong>
            <ul className="list-disc ml-6 text-gray-700">
              {Array.isArray(recipe.ingredients)
                ? recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)
                : <li>{recipe.ingredients}</li>}
            </ul>
          </div>

          <div>
            <strong>Instructions:</strong>
            <ol className="list-decimal ml-6 text-gray-700">
              {Array.isArray(recipe.instructions)
                ? recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)
                : <li>{recipe.instructions}</li>}
            </ol>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                startEdit(recipe);
                navigate("/new");
              }}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={() => deleteRecipe(recipe.id)}
              className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

