//per far funzionare non staticamente
export default async function handler(req, res) {
  const { input } = req.body;
  const apiKey ="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";

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

