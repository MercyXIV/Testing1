import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { user, message } = req.body

  if (!message || message.length > 200) {
    return res.status(400).json({ error: "Invalid message" })
  }

  const payload = {
    user: user || "Guest",
    message: message.trim(),
    time: Date.now(),
  }

  // 🔥 ONE command → infinite listeners
  await redis.publish("global-chat", payload)

  res.json({ ok: true })
}
