import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ForumPost } from "@shared/schema";

export default function CommunityForum() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getAnonymousSession();

  const { data: forumPosts = [] } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/posts"],
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
    // Generate consistent anonymous ID based on session
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

  return (
    <section data-testid="community-forum">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-card-foreground">Anonymous Community Support</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-new-post">
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
                  <SelectTrigger className="mt-1" data-testid="select-category">
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

      <div className="space-y-4" data-testid="forum-posts">
        {forumPosts.map((post) => (
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
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(post.createdAt)} • {post.category.replace('_', ' ')} Support
                    </span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {post.isModerated ? "Moderated" : "Active"}
                </span>
              </div>
              
              <h5 className="font-semibold mb-2 text-card-foreground" data-testid={`post-title-${post.id}`}>
                {post.title}
              </h5>
              <p className="text-muted-foreground text-sm mb-4" data-testid={`post-content-${post.id}`}>
                {post.content}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <button
                  className="hover:text-accent flex items-center space-x-1"
                  onClick={() => likeMutation.mutate(post.id)}
                  disabled={likeMutation.isPending}
                  data-testid={`button-like-post-${post.id}`}
                >
                  <i className="fas fa-heart"></i>
                  <span>{post.likesCount || 0} hearts</span>
                </button>
                <button className="hover:text-primary flex items-center space-x-1" data-testid={`button-replies-${post.id}`}>
                  <i className="fas fa-comment"></i>
                  <span>{post.repliesCount || 0} replies</span>
                </button>
                <button className="hover:text-primary flex items-center space-x-1" data-testid={`button-share-${post.id}`}>
                  <i className="fas fa-share"></i>
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {forumPosts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <i className="fas fa-comments text-4xl text-muted-foreground mb-4"></i>
              <h4 className="font-semibold mb-2">No posts yet</h4>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in the community
              </p>
              <Button onClick={() => setDialogOpen(true)} data-testid="button-create-first-post">
                <i className="fas fa-plus mr-2"></i>Create First Post
              </Button>
            </CardContent>
          </Card>
        )}

        {forumPosts.length > 0 && (
          <Button variant="outline" className="w-full py-3" data-testid="button-load-more-posts">
            Load More Discussions
          </Button>
        )}
      </div>
    </section>
  );
}
