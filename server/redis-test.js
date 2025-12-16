const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const app = express();

// Initialize Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:", // Optional: Customize your key prefix
});

// Configure session middleware
app.use(
  session({
    store: redisStore, // Use Redis store for sessions
    secret: "keyboard cat", // Use a secure secret in production
    resave: false, // Avoid unnecessary session resaving
    saveUninitialized: false, // Don't create sessions until data is stored
    cookie: {
      maxAge: 86400000, // 1 day in milliseconds
      httpOnly: true,   // Prevent JavaScript access
      sameSite: "lax",  // Adjust for cross-origin requests if necessary
      secure: false,    // Set to true for HTTPS
    },
  })
);

app.use((req, res, next) => {
    console.log('Session middleware:', req.session);
    const cookies = {};
  const rawCookies = req.headers.cookie;

  if (rawCookies) {
    rawCookies.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = decodeURIComponent(value);
    });
  }

  req.cookies = cookies; // Attach parsed cookies to the request object
  console.log(req.cookies);
    next();
  });

// Test route to set session data
app.get("/set-session", (req, res) => {
  req.session.username = "JohnDoe"; // Set session data
  res.send("Session data has been set.");
});

// Test route to retrieve session data
app.get("/get-session", (req, res) => {
  if (req.session.username) {
    res.send(`Session username: ${req.session.username}`);
  } else {
    res.send("No session data found.");
  }
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
