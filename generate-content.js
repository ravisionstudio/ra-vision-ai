export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Only POST requests are allowed",
    });
  }

  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // Call OpenAI Image Generation API
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          size: "1024x1024",
        }),
      }
    );

    const data = await openaiResponse.json();

    // Handle OpenAI errors
    if (data.error) {
      return res.status(500).json({
        success: false,
        error: data.error.message,
      });
    }

    // Success response
    if (data.data && data.data.length > 0) {
      return res.status(200).json({
        success: true,
        image: data.data[0].url,
        message: "Image generated successfully",
      });
    }

    // Unknown error fallback
    return res.status(500).json({
      success: false,
      error: "Image generation failed",
    });
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
