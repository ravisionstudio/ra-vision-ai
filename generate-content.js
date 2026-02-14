export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ---- MODELSLAB API CALL ----
    const response = await fetch("https://modelslab.com/api/v6/realtime/text2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.MODELSLAB_API_KEY,
        prompt: prompt,
        model_id: "flux",
        width: "1024",
        height: "1024",
        samples: "1",
        num_inference_steps: "30",
        guidance_scale: 7.5,
        safety_checker: "no",
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      return res.status(200).json({
        success: true,
        image: data.output[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        error: data.message || "Image generation failed",
      });
    }
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
}
