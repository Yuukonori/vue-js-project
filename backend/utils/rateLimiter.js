/**
 * Rate Limiter Middleware
 * Protects the login endpoint from brute-force attacks
 */

const rateLimit = require('express-rate-limit');

/**
 * Login Rate Limiter
 * Allows 10 login attempts per 1 minute per IP address.
 * After 10 failed attempts, the user must wait 1 minute before trying again.
 */
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10,                  // Max 10 requests per window
  standardHeaders: true,    // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,     // Disable the X-RateLimit-* headers
  message: {
    error: 'Too many login attempts. Please wait 1 minute before trying again.'
  },
  handler: (req, res, next, options) => {
    console.warn(`[Rate Limit] IP ${req.ip} blocked after too many login attempts.`);
    res.status(429).json(options.message);
  }
});

module.exports = { loginRateLimiter };
