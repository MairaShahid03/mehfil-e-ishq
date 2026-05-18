export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        reply: "API key missing on server",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data); // 🔥 important

    if (!response.ok) {
      return res.status(500).json({
        reply: "API Error: " + JSON.stringify(data),
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(200).json({
        reply: "No valid response from AI",
      });
    }

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      reply: "Server error occurred",
    });
  }
}