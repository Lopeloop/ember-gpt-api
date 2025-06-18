import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
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

    // 🟡 Лог статуса
    console.log("📡 OpenAI status:", response.status);

    // 🟥 Обработка ошибки статуса
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenAI error response:", errText);
      return res.status(500).send({ error: "OpenAI error", details: errText });
    }

    const json = await response.json();
    console.log("📥 OpenAI response:", JSON.stringify(json, null, 2));

    const reply = json?.choices?.[0]?.message?.content || "No response from model";
    res.send({ reply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
