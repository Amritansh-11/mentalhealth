import {
  type Assessment,
  type InsertAssessment,
  type MoodEntry,
  type InsertMoodEntry,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type Resource,
  type InsertResource,
  type CampusService,
  type InsertCampusService,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsBySession(sessionId: string): Promise<Assessment[]>;
  
  // Mood tracking methods
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntriesBySession(sessionId: string, limit?: number): Promise<MoodEntry[]>;
  
  // Forum methods
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPosts(category?: string, limit?: number): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  likeForumPost(id: string): Promise<void>;
  
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  getForumReplies(postId: string): Promise<ForumReply[]>;
  likeForumReply(id: string): Promise<void>;
  
  // Resource methods
  getResources(category?: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  
  // Campus services methods
  getCampusServices(type?: string): Promise<CampusService[]>;
}

export class MemStorage implements IStorage {
  private assessments: Map<string, Assessment>;
  private moodEntries: Map<string, MoodEntry>;
  private forumPosts: Map<string, ForumPost>;
  private forumReplies: Map<string, ForumReply>;
  private resources: Map<string, Resource>;
  private campusServices: Map<string, CampusService>;

  constructor() {
    this.assessments = new Map();
    this.moodEntries = new Map();
    this.forumPosts = new Map();
    this.forumReplies = new Map();
    this.resources = new Map();
    this.campusServices = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed resources
    const resourceData: Resource[] = [
      {
        id: "1",
        title: "Understanding Anxiety",
        content: "Comprehensive guide to understanding anxiety symptoms, triggers, and management strategies.",
        category: "anxiety",
        type: "article",
        readTime: 5,
        icon: "fas fa-book",
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Coping Strategies Guide",
        content: "Practical coping strategies for managing stress and anxiety in daily life.",
        category: "general",
        type: "article",
        readTime: 8,
        icon: "fas fa-brain",
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Sleep Hygiene Tips",
        content: "Essential tips for improving sleep quality and establishing healthy sleep habits.",
        category: "sleep",
        type: "article",
        readTime: 4,
        icon: "fas fa-moon",
        createdAt: new Date(),
      },
      {
        id: "4",
        title: "Exercise & Mental Health",
        content: "How physical activity can improve mental health and reduce symptoms of depression and anxiety.",
        category: "general",
        type: "article",
        readTime: 6,
        icon: "fas fa-dumbbell",
        createdAt: new Date(),
      },
    ];

    resourceData.forEach(resource => this.resources.set(resource.id, resource));

    // Seed campus services
    const serviceData: CampusService[] = [
      {
        id: "1",
        name: "Student Counseling Center",
        description: "Individual and group counseling sessions",
        type: "counseling",
        availability: "Mon-Fri 8AM-6PM",
        contact: "(555) 123-4567",
        location: "Student Services Building, Room 201",
        bookingUrl: "https://counseling.university.edu/book",
      },
      {
        id: "2",
        name: "Peer Support Groups",
        description: "Weekly support group meetings",
        type: "support_group",
        availability: "Tuesdays 3PM, Student Union",
        contact: "peersupport@university.edu",
        location: "Student Union, Conference Room A",
        bookingUrl: null,
      },
      {
        id: "3",
        name: "Campus Wellness Center",
        description: "Mindfulness workshops and stress relief",
        type: "wellness",
        availability: "Drop-in sessions available",
        contact: "(555) 123-4580",
        location: "Recreation Center, 2nd Floor",
        bookingUrl: "https://wellness.university.edu/schedule",
      },
    ];

    serviceData.forEach(service => this.campusServices.set(service.id, service));
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessmentsBySession(sessionId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.sessionId === sessionId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const entry: MoodEntry = {
      ...insertEntry,
      id,
      notes: insertEntry.notes ?? null,
      sleepHours: insertEntry.sleepHours ?? null,
      stressLevel: insertEntry.stressLevel ?? null,
      createdAt: new Date(),
    };
    this.moodEntries.set(id, entry);
    return entry;
  }

  async getMoodEntriesBySession(sessionId: string, limit = 30): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.sessionId === sessionId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = randomUUID();
    const post: ForumPost = {
      ...insertPost,
      id,
      isModerated: false,
      likesCount: 0,
      repliesCount: 0,
      createdAt: new Date(),
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async getForumPosts(category?: string, limit = 20): Promise<ForumPost[]> {
    let posts = Array.from(this.forumPosts.values());
    
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    return posts
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async likeForumPost(id: string): Promise<void> {
    const post = this.forumPosts.get(id);
    if (post) {
      post.likesCount = (post.likesCount || 0) + 1;
      this.forumPosts.set(id, post);
    }
  }

  async createForumReply(insertReply: InsertForumReply): Promise<ForumReply> {
    const id = randomUUID();
    const reply: ForumReply = {
      ...insertReply,
      id,
      likesCount: 0,
      createdAt: new Date(),
    };
    this.forumReplies.set(id, reply);
    
    // Update post reply count
    const post = this.forumPosts.get(insertReply.postId);
    if (post) {
      post.repliesCount = (post.repliesCount || 0) + 1;
      this.forumPosts.set(insertReply.postId, post);
    }
    
    return reply;
  }

  async getForumReplies(postId: string): Promise<ForumReply[]> {
    return Array.from(this.forumReplies.values())
      .filter(reply => reply.postId === postId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async likeForumReply(id: string): Promise<void> {
    const reply = this.forumReplies.get(id);
    if (reply) {
      reply.likesCount = (reply.likesCount || 0) + 1;
      this.forumReplies.set(id, reply);
    }
  }

  async getResources(category?: string): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (category) {
      resources = resources.filter(resource => resource.category === category);
    }
    
    return resources.sort((a, b) => a.title.localeCompare(b.title));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getCampusServices(type?: string): Promise<CampusService[]> {
    let services = Array.from(this.campusServices.values());
    
    if (type) {
      services = services.filter(service => service.type === type);
    }
    
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const storage = new MemStorage();
