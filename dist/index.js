// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  assessments;
  moodEntries;
  forumPosts;
  forumReplies;
  resources;
  campusServices;
  constructor() {
    this.assessments = /* @__PURE__ */ new Map();
    this.moodEntries = /* @__PURE__ */ new Map();
    this.forumPosts = /* @__PURE__ */ new Map();
    this.forumReplies = /* @__PURE__ */ new Map();
    this.resources = /* @__PURE__ */ new Map();
    this.campusServices = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
    const resourceData = [
      {
        id: "1",
        title: "Understanding Anxiety",
        content: "Comprehensive guide to understanding anxiety symptoms, triggers, and management strategies.",
        category: "anxiety",
        type: "article",
        readTime: 5,
        icon: "fas fa-book",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "2",
        title: "Coping Strategies Guide",
        content: "Practical coping strategies for managing stress and anxiety in daily life.",
        category: "general",
        type: "article",
        readTime: 8,
        icon: "fas fa-brain",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "3",
        title: "Sleep Hygiene Tips",
        content: "Essential tips for improving sleep quality and establishing healthy sleep habits.",
        category: "sleep",
        type: "article",
        readTime: 4,
        icon: "fas fa-moon",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "4",
        title: "Exercise & Mental Health",
        content: "How physical activity can improve mental health and reduce symptoms of depression and anxiety.",
        category: "general",
        type: "article",
        readTime: 6,
        icon: "fas fa-dumbbell",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    resourceData.forEach((resource) => this.resources.set(resource.id, resource));
    const serviceData = [
      {
        id: "1",
        name: "Student Counseling Center",
        description: "Individual and group counseling sessions",
        type: "counseling",
        availability: "Mon-Fri 8AM-6PM",
        contact: "(555) 123-4567",
        location: "Student Services Building, Room 201",
        bookingUrl: "https://counseling.university.edu/book"
      },
      {
        id: "2",
        name: "Peer Support Groups",
        description: "Weekly support group meetings",
        type: "support_group",
        availability: "Tuesdays 3PM, Student Union",
        contact: "peersupport@university.edu",
        location: "Student Union, Conference Room A",
        bookingUrl: null
      },
      {
        id: "3",
        name: "Campus Wellness Center",
        description: "Mindfulness workshops and stress relief",
        type: "wellness",
        availability: "Drop-in sessions available",
        contact: "(555) 123-4580",
        location: "Recreation Center, 2nd Floor",
        bookingUrl: "https://wellness.university.edu/schedule"
      }
    ];
    serviceData.forEach((service) => this.campusServices.set(service.id, service));
  }
  async createAssessment(insertAssessment) {
    const id = randomUUID();
    const assessment = {
      ...insertAssessment,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.assessments.set(id, assessment);
    return assessment;
  }
  async getAssessmentsBySession(sessionId) {
    return Array.from(this.assessments.values()).filter((assessment) => assessment.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async createMoodEntry(insertEntry) {
    const id = randomUUID();
    const entry = {
      ...insertEntry,
      id,
      notes: insertEntry.notes ?? null,
      sleepHours: insertEntry.sleepHours ?? null,
      stressLevel: insertEntry.stressLevel ?? null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.moodEntries.set(id, entry);
    return entry;
  }
  async getMoodEntriesBySession(sessionId, limit = 30) {
    return Array.from(this.moodEntries.values()).filter((entry) => entry.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  async createForumPost(insertPost) {
    const id = randomUUID();
    const post = {
      ...insertPost,
      id,
      isModerated: false,
      likesCount: 0,
      repliesCount: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.forumPosts.set(id, post);
    return post;
  }
  async getForumPosts(category, limit = 20) {
    let posts = Array.from(this.forumPosts.values());
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  async getForumPost(id) {
    return this.forumPosts.get(id);
  }
  async likeForumPost(id) {
    const post = this.forumPosts.get(id);
    if (post) {
      post.likesCount = (post.likesCount || 0) + 1;
      this.forumPosts.set(id, post);
    }
  }
  async createForumReply(insertReply) {
    const id = randomUUID();
    const reply = {
      ...insertReply,
      id,
      likesCount: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.forumReplies.set(id, reply);
    const post = this.forumPosts.get(insertReply.postId);
    if (post) {
      post.repliesCount = (post.repliesCount || 0) + 1;
      this.forumPosts.set(insertReply.postId, post);
    }
    return reply;
  }
  async getForumReplies(postId) {
    return Array.from(this.forumReplies.values()).filter((reply) => reply.postId === postId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  async likeForumReply(id) {
    const reply = this.forumReplies.get(id);
    if (reply) {
      reply.likesCount = (reply.likesCount || 0) + 1;
      this.forumReplies.set(id, reply);
    }
  }
  async getResources(category) {
    let resources2 = Array.from(this.resources.values());
    if (category) {
      resources2 = resources2.filter((resource) => resource.category === category);
    }
    return resources2.sort((a, b) => a.title.localeCompare(b.title));
  }
  async getResource(id) {
    return this.resources.get(id);
  }
  async getCampusServices(type) {
    let services = Array.from(this.campusServices.values());
    if (type) {
      services = services.filter((service) => service.type === type);
    }
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  type: varchar("type").notNull(),
  // 'anxiety', 'depression', 'stress', 'sleep'
  responses: json("responses").notNull(),
  score: integer("score").notNull(),
  severity: varchar("severity").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  mood: integer("mood").notNull(),
  // 1-10 scale
  notes: text("notes"),
  sleepHours: integer("sleep_hours"),
  stressLevel: integer("stress_level"),
  // 1-10 scale
  createdAt: timestamp("created_at").defaultNow()
});
var forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  // 'anxiety', 'depression', 'stress', 'general'
  isModerated: boolean("is_moderated").default(false),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  // 'anxiety', 'depression', 'stress', 'sleep', 'general'
  type: varchar("type").notNull(),
  // 'article', 'video', 'audio', 'exercise'
  readTime: integer("read_time"),
  // in minutes
  icon: varchar("icon"),
  createdAt: timestamp("created_at").defaultNow()
});
var campusServices = pgTable("campus_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(),
  // 'counseling', 'support_group', 'wellness', 'crisis'
  availability: text("availability"),
  contact: text("contact"),
  location: text("location"),
  bookingUrl: text("booking_url")
});
var insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true
});
var insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true
});
var insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  likesCount: true,
  repliesCount: true,
  isModerated: true
});
var insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  likesCount: true
});
var insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true
});
var insertCampusServiceSchema = createInsertSchema(campusServices).omit({
  id: true
});

// shared/scoring.ts
var ASSESSMENT_SCORING_KEYS = {
  anxiety: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  },
  depression: {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
  },
  stress: {
    "Never": 0,
    "Almost never": 1,
    "Sometimes": 2,
    "Fairly often": 3,
    "Very often": 4
  },
  sleep: {
    "Very good": 0,
    "Fairly good": 1,
    "Fairly bad": 2,
    "Very bad": 3,
    "\u226415 minutes": 0,
    "16-30 minutes": 1,
    "31-60 minutes": 2,
    ">60 minutes": 3,
    ">7 hours": 0,
    "6-7 hours": 1,
    "5-6 hours": 2,
    "<5 hours": 3,
    "Not during the past month": 0,
    "Less than once a week": 1,
    "Once or twice a week": 2,
    "Three or more times a week": 3
  }
};
function calculateAssessmentScore(type, responses) {
  const scoringKey = ASSESSMENT_SCORING_KEYS[type];
  if (!scoringKey) {
    throw new Error(`Unknown assessment type: ${type}`);
  }
  let totalScore = 0;
  Object.entries(responses).forEach(([questionId, answer]) => {
    const scoreValue = scoringKey[answer];
    if (scoreValue !== void 0) {
      totalScore += scoreValue;
    }
  });
  const severity = getSeverityLevel(totalScore, type);
  return { score: totalScore, severity };
}
function getSeverityLevel(score, type) {
  switch (type) {
    case "anxiety":
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      return "Severe";
    case "depression":
      if (score <= 4) return "Minimal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      if (score <= 19) return "Moderately Severe";
      return "Severe";
    case "stress":
      if (score <= 5) return "Low";
      if (score <= 11) return "Moderate";
      return "High";
    case "sleep":
      if (score <= 5) return "Good";
      if (score <= 10) return "Fair";
      return "Poor";
    default:
      return "Unknown";
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/assessments", async (req, res) => {
    try {
      const requestData = req.body;
      const { score: calculatedScore, severity: calculatedSeverity } = calculateAssessmentScore(
        requestData.type,
        requestData.responses
      );
      const validatedData = insertAssessmentSchema.parse({
        ...requestData,
        score: calculatedScore,
        severity: calculatedSeverity
      });
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data", error: error instanceof Error ? error.message : error });
    }
  });
  app2.get("/api/assessments/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const assessments2 = await storage.getAssessmentsBySession(sessionId);
      res.json(assessments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments", error });
    }
  });
  app2.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood entry data", error });
    }
  });
  app2.get("/api/mood-entries/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const entries = await storage.getMoodEntriesBySession(sessionId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries", error });
    }
  });
  app2.post("/api/forum/posts", async (req, res) => {
    try {
      const validatedData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(validatedData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum post data", error });
    }
  });
  app2.get("/api/forum/posts", async (req, res) => {
    try {
      const category = req.query.category;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const posts = await storage.getForumPosts(category, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum posts", error });
    }
  });
  app2.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getForumPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum post", error });
    }
  });
  app2.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumPost(id);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post", error });
    }
  });
  app2.post("/api/forum/replies", async (req, res) => {
    try {
      const validatedData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(validatedData);
      res.json(reply);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum reply data", error });
    }
  });
  app2.get("/api/forum/posts/:postId/replies", async (req, res) => {
    try {
      const { postId } = req.params;
      const replies = await storage.getForumReplies(postId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum replies", error });
    }
  });
  app2.post("/api/forum/replies/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumReply(id);
      res.json({ message: "Reply liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like reply", error });
    }
  });
  app2.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category;
      const resources2 = await storage.getResources(category);
      res.json(resources2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources", error });
    }
  });
  app2.get("/api/resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getResource(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource", error });
    }
  });
  app2.get("/api/campus-services", async (req, res) => {
    try {
      const type = req.query.type;
      const services = await storage.getCampusServices(type);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campus services", error });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
