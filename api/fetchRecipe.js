export default async function handler(req, res) {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Generate a recipe for: ${query}. Return JSON: title, ingredients (array), instructions (array), date (YYYY-MM-DD).`
        }),
      }
    );

    const data = await response.json();
    const text = data?.[0]?.generated_text || data?.generated_text || "{}";

    let recipe;
    try {
      recipe = JSON.parse(text);
    } catch {
      recipe = { title: query, ingredients: ["Example ingredient"], instructions: ["Example step"], date: new Date().toISOString().split("T")[0] };
    }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
