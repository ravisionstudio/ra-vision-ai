 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try 1{
    const { prompt, size } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: size || "1024x1024"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data });
    }

    return res.status(200).json({
      success: true,
      image: data.data[0].url
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
