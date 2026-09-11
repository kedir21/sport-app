import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CDN Live TV API Proxy
  app.get("/api/sports/all", async (req, res) => {
    try {
      const response = await fetch("https://api.cdnlivetv.is/api/v1/events/sports/?user=cdnlivetv&plan=free");
      if (!response.ok) {
        throw new Error(`CDN API responded with ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching sports events:", error);
      res.status(500).json({ error: "Failed to fetch sports events" });
    }
  });

  // API routes FIRST - this demonstrates the backend proxy layer
  app.get("/api/football/matches", (req, res) => {
    // Mock response from server
    res.json({ status: "ok", data: [] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
