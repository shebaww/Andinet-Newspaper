// src/utils/rateLimiter.js
class RateLimiter {
  constructor(limit = 5, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  check(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentRequests.length >= this.limit) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

// Create instances for different actions
export const commentLimiter = new RateLimiter(3, 30000); // 3 comments per 30 seconds
export const postLimiter = new RateLimiter(2, 60000);   // 2 posts per minute
export const contactLimiter = new RateLimiter(1, 300000); // 1 contact form per 5 minutes

export default RateLimiter;
