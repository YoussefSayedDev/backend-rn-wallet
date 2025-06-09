import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Get user's IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    const { success } = await ratelimit.limit(ip); // use IP as unique key

    if (!success) {
      return res.status(429).json({ error: "Too many requests" });
    }

    next();
  } catch (error) {
    console.error("Error rate limiting", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default rateLimiter;
