import { WEATHER_API_BASE_URL } from "@/lib/constants"

// Forwards a multipart image upload to the WeatherAI tree analysis endpoint.
export async function POST(request: Request) {
  const apiKey = process.env.WEATHER_AI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json(
      { error: "Expected multipart/form-data" },
      { status: 400 },
    )
  }

  const res = await fetch(`${WEATHER_API_BASE_URL}/v1/trees/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text()
    return Response.json({ error: body }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
