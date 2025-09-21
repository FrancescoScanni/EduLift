//per far funzionare non staticamente
export default async function handler(req, res) {
  const { input } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: input }],
      max_tokens: 800
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
