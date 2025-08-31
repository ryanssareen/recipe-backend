export default async function handler(req, res) {
  const { query } = await req.body ? JSON.parse(req.body) : {};
  if (!query) return res.status(400).json({ error: "No query provided" });

  // For now, return a dummy recipe
  const recipe = {
    title: query,
    ingredients: ["1 cup example ingredient", "2 tsp example spice"],
    instructions: ["Step 1: Do something", "Step 2: Do something else"],
    date: new Date().toISOString().split("T")[0],
  };

  res.status(200).json(recipe);
}

