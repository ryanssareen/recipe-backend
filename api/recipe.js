import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/recipes", async (req, res) => {
  const { query } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give me a recipe for ${query}. Return JSON only in this exact structure: 
{
  "title": "Recipe Title",
  "ingredients": ["item 1", "item 2"],
  "instructions": ["step 1", "step 2"]
}`
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const recipe = JSON.parse(raw);

    res.json(recipe);
  } catch (err) {
    console.error("Gemini fetch error:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

