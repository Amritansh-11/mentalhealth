import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ForumPost, ForumReply } from "@shared/schema";

export default function Community() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getAnonymousSession();

  const { data: forumPosts = [], isLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/posts"],
  });

  const { data: replies = [] } = useQuery<ForumReply[]>({
    queryKey: ["/api/forum/posts", expandedPost, "replies"],
    enabled: !!expandedPost,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/forum/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Post Created",
        description: "Your anonymous post has been shared with the community.",
      });
      setDialogOpen(false);
      setTitle("");
      setContent("");
      setCategory("");
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      return apiRequest("POST", `/api/forum/posts/${postId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
  });

  const filteredPosts = forumPosts.filter((post) => {
    return selectedCategory === "all" || post.category === selectedCategory;
  });

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await mutation.mutateAsync({
        sessionId: session.id,
        title: title.trim(),
        content: content.trim(),
        category,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAnonymousId = (sessionId: string) => {
    const hash = sessionId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 9999) + 1000;
  };

  const getTimeAgo = (date: Date | string | null) => {
    if (!date) return "Just now";
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "anxiety": return "bg-blue-100 text-blue-800";
      case "depression": return "bg-indigo-100 text-indigo-800";
      case "stress": return "bg-orange-100 text-orange-800";
      case "general": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8" data-testid="community-page">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8" data-testid="community-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Anonymous Community Support</h1>
        <p className="text-muted-foreground mb-6">
          Connect with peers in a safe, anonymous environment. Share experiences, offer support, 
          and find encouragement from others who understand your journey.
        </p>

        <div className="flex justify-between items-center">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" data-testid="tab-all-posts">All Posts</TabsTrigger>
              <TabsTrigger value="anxiety" data-testid="tab-anxiety">Anxiety</TabsTrigger>
              <TabsTrigger value="depression" data-testid="tab-depression">Depression</TabsTrigger>
              <TabsTrigger value="stress" data-testid="tab-stress">Stress</TabsTrigger>
              <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-4 bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-new-post">
                <i className="fas fa-plus mr-2"></i>New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Anonymous Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1" data-testid="select-post-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety Support</SelectItem>
                      <SelectItem value="depression">Depression Support</SelectItem>
                      <SelectItem value="stress">Stress Management</SelectItem>
                      <SelectItem value="general">General Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    placeholder="What would you like to discuss?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                    data-testid="input-post-title"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, experiences, or ask for support..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1"
                    rows={4}
                    data-testid="textarea-post-content"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="w-full"
                  data-testid="button-submit-post"
                >
                  {mutation.isPending ? "Posting..." : "Post Anonymously"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6" data-testid="forum-posts">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <i className="fas fa-comments text-4xl text-muted-foreground mb-4"></i>
              <h3 className="font-semibold mb-2">
                {selectedCategory === "all" ? "No posts yet" : `No ${selectedCategory} posts yet`}
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in this category
              </p>
              <Button onClick={() => setDialogOpen(true)} data-testid="button-create-first-post">
                <i className="fas fa-plus mr-2"></i>Create Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold">
                      A#
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        Anonymous User #{getAnonymousId(post.sessionId)}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{getTimeAgo(post.createdAt)}</span>
                        <Badge className={`${getCategoryColor(post.category)} text-xs`}>
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant={post.isModerated ? "default" : "secondary"} className="text-xs">
                    {post.isModerated ? "Moderated" : "Active"}
                  </Badge>
                </div>
                
                <h5 className="font-semibold mb-2 text-card-foreground" data-testid={`post-title-${post.id}`}>
                  {post.title}
                </h5>
                <p className="text-muted-foreground text-sm mb-4" data-testid={`post-content-${post.id}`}>
                  {post.content}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <button
                    className="hover:text-accent flex items-center space-x-1 transition-colors"
                    onClick={() => likeMutation.mutate(post.id)}
                    disabled={likeMutation.isPending}
                    data-testid={`button-like-post-${post.id}`}
                  >
                    <i className="fas fa-heart"></i>
                    <span>{post.likesCount || 0} hearts</span>
                  </button>
                  <button 
                    className="hover:text-primary flex items-center space-x-1 transition-colors" 
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    data-testid={`button-replies-${post.id}`}
                  >
                    <i className="fas fa-comment"></i>
                    <span>{post.repliesCount || 0} replies</span>
                  </button>
                  <button className="hover:text-primary flex items-center space-x-1 transition-colors" data-testid={`button-share-${post.id}`}>
                    <i className="fas fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>

                {expandedPost === post.id && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h6 className="font-semibold mb-4">Replies</h6>
                    {replies.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No replies yet. Be the first to respond!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {replies.map((reply) => (
                          <div key={reply.id} className="bg-secondary p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                A#
                              </div>
                              <div>
                                <span className="font-medium text-sm">
                                  Anonymous User #{getAnonymousId(reply.sessionId)}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {getTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {filteredPosts.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="w-full py-3" data-testid="button-load-more-posts">
              Load More Discussions
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Community Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <i className="fas fa-shield-alt text-accent text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Stay Anonymous</h4>
                <p className="text-muted-foreground">
                  Never share personal identifying information to maintain everyone's privacy and safety.
                </p>
              </div>
              <div>
                <i className="fas fa-heart text-accent text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Be Supportive</h4>
                <p className="text-muted-foreground">
                  Offer encouragement and understanding. Remember that everyone is on their own unique journey.
                </p>
              </div>
              <div>
                <i className="fas fa-flag text-accent text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Report Concerns</h4>
                <p className="text-muted-foreground">
                  If you see harmful content or someone in crisis, please report it immediately for moderation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
