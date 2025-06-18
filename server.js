import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/gpt", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: req.body.focus || "Hello" }
        ]
      })
    });

    // 🔹 Новая строчка: логируем статус ответа
    console.log("📥 Got response:", response.status);

    const json = await response.json();

    // 🔹 Новая строчка: логируем весь JSON ответ
    console.log("✅ JSON from OpenAI:", JSON.stringify(json, null, 2));

    res.send({ reply: json.choices?.[0]?.message?.content || "No response from model" });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
