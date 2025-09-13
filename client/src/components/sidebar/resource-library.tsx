import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@shared/schema";

export default function ResourceLibrary() {
  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const getIconColor = (category: string) => {
    switch (category) {
      case "anxiety": return "text-blue-600";
      case "depression": return "text-indigo-600";
      case "stress": return "text-orange-600";
      case "sleep": return "text-purple-600";
      case "general": return "text-green-600";
      default: return "text-primary";
    }
  };

  const getIconBg = (category: string) => {
    switch (category) {
      case "anxiety": return "bg-blue-100";
      case "depression": return "bg-indigo-100";
      case "stress": return "bg-orange-100";
      case "sleep": return "bg-purple-100";
      case "general": return "bg-green-100";
      default: return "bg-primary/10";
    }
  };

  const featuredResources = resources.slice(0, 4);

  return (
    <section data-testid="resource-library">
      <h3 className="text-lg font-bold mb-4 text-card-foreground">Resource Library</h3>
      <div className="space-y-3">
        {featuredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-sm transition-shadow cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getIconBg(resource.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`${resource.icon || 'fas fa-book'} ${getIconColor(resource.category)}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors line-clamp-1" data-testid={`resource-title-${resource.id}`}>
                    {resource.title}
                  </h5>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </Badge>
                    {resource.readTime && (
                      <span className="text-xs text-muted-foreground" data-testid={`resource-read-time-${resource.id}`}>
                        {resource.readTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {resources.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <i className="fas fa-book text-3xl text-muted-foreground mb-3"></i>
              <p className="text-sm text-muted-foreground">
                Resources are being loaded...
              </p>
            </CardContent>
          </Card>
        )}

        <Button 
          variant="outline" 
          className="w-full"
          data-testid="button-browse-all-resources"
        >
          <i className="fas fa-book-open mr-2"></i>Browse All Resources
        </Button>
      </div>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <i className="fas fa-lightbulb text-accent mt-1"></i>
          <div>
            <h5 className="font-semibold text-sm text-accent mb-1">Quick Tips</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Start with small, manageable steps</li>
              <li>• Practice self-compassion daily</li>
              <li>• Remember that seeking help is strength</li>
              <li>• Take breaks when you need them</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
