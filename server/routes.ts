import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertMoodEntrySchema, insertForumPostSchema, insertForumReplySchema } from "@shared/schema";
import { calculateAssessmentScore } from "@shared/scoring";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const requestData = req.body;
      
      // Server-side score validation and recalculation
      const { score: calculatedScore, severity: calculatedSeverity } = calculateAssessmentScore(
        requestData.type,
        requestData.responses
      );
      
      // Use server-calculated values, ignore client-sent scores
      const validatedData = insertAssessmentSchema.parse({
        ...requestData,
        score: calculatedScore,
        severity: calculatedSeverity,
      });
      
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data", error: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/assessments/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const assessments = await storage.getAssessmentsBySession(sessionId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments", error });
    }
  });

  // Mood tracking routes
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood entry data", error });
    }
  });

  app.get("/api/mood-entries/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getMoodEntriesBySession(sessionId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries", error });
    }
  });

  // Forum routes
  app.post("/api/forum/posts", async (req, res) => {
    try {
      const validatedData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(validatedData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum post data", error });
    }
  });

  app.get("/api/forum/posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getForumPosts(category, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum posts", error });
    }
  });

  app.get("/api/forum/posts/:id", async (req, res) => {
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

  app.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumPost(id);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post", error });
    }
  });

  app.post("/api/forum/replies", async (req, res) => {
    try {
      const validatedData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(validatedData);
      res.json(reply);
    } catch (error) {
      res.status(400).json({ message: "Invalid forum reply data", error });
    }
  });

  app.get("/api/forum/posts/:postId/replies", async (req, res) => {
    try {
      const { postId } = req.params;
      const replies = await storage.getForumReplies(postId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum replies", error });
    }
  });

  app.post("/api/forum/replies/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.likeForumReply(id);
      res.json({ message: "Reply liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like reply", error });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const resources = await storage.getResources(category);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources", error });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
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

  // Campus services routes
  app.get("/api/campus-services", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const services = await storage.getCampusServices(type);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campus services", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
