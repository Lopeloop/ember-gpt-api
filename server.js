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

    const json = await response.json();

    // лог ответа OpenAI
    console.log("🦉 OpenAI response:", JSON.stringify(json, null, 2));

    // если есть ошибка — отправим её клиенту
    if (json.error) {
      console.error("❌ OpenAI error:", json.error);
      return res.status(500).send({ error: "OpenAI error", details: json.error });
    }

    const reply = json.choices?.[0]?.message?.content || "No response from model";
    res.send({ reply });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
