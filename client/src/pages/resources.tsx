import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@shared/schema";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconColor = (category: string) => {
    switch (category) {
      case "anxiety": return "text-primary";
      case "depression": return "text-blue-500";
      case "stress": return "text-orange-500";
      case "sleep": return "text-purple-500";
      case "general": return "text-green-500";
      default: return "text-primary";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "anxiety": return "bg-blue-100 text-blue-800";
      case "depression": return "bg-indigo-100 text-indigo-800";
      case "stress": return "bg-orange-100 text-orange-800";
      case "sleep": return "bg-purple-100 text-purple-800";
      case "general": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8" data-testid="resources-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
    <main className="max-w-6xl mx-auto px-4 py-8" data-testid="resources-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mental Health Resource Library</h1>
        <p className="text-muted-foreground mb-6">
          Explore our comprehensive collection of mental health resources, articles, and coping strategies.
          All content is curated by mental health professionals and designed to support your wellbeing journey.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              data-testid="input-search-resources"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-resource-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="anxiety">Anxiety</SelectItem>
              <SelectItem value="depression">Depression</SelectItem>
              <SelectItem value="stress">Stress Management</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="general">General Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <h3 className="font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Resources are being loaded"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="resources-grid">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <i className={`${resource.icon || 'fas fa-book'} ${getIconColor(resource.category)} text-xl`}></i>
                      <Badge className={`text-xs ${getCategoryBadgeColor(resource.category)}`}>
                        {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                      </Badge>
                    </div>
                    {resource.readTime && (
                      <span className="text-xs text-muted-foreground">
                        {resource.readTime} min read
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors" data-testid={`resource-title-${resource.id}`}>
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4" data-testid={`resource-content-${resource.id}`}>
                    {resource.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground capitalize">
                      <i className={`fas ${resource.type === 'article' ? 'fa-file-text' : resource.type === 'video' ? 'fa-play' : resource.type === 'audio' ? 'fa-volume-up' : 'fa-dumbbell'} mr-1`}></i>
                      {resource.type}
                    </span>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80" data-testid={`button-read-${resource.id}`}>
                      Read More <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Need Professional Support?</h3>
                <p className="text-muted-foreground mb-6">
                  While these resources are helpful, they're not a substitute for professional mental health care. 
                  If you're experiencing persistent symptoms, consider reaching out to a mental health professional.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-primary text-primary-foreground" data-testid="button-campus-services">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    Find Campus Services
                  </Button>
                  <Button variant="outline" data-testid="button-crisis-support">
                    <i className="fas fa-phone mr-2"></i>
                    Crisis Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}
