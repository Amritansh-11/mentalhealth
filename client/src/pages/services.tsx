import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampusService } from "@shared/schema";

export default function Services() {
  const { data: services = [], isLoading } = useQuery<CampusService[]>({
    queryKey: ["/api/campus-services"],
  });

  const getServicesByType = (type: string) => {
    return services.filter(service => service.type === type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "counseling": return "fas fa-user-md";
      case "support_group": return "fas fa-users";
      case "wellness": return "fas fa-leaf";
      case "crisis": return "fas fa-exclamation-triangle";
      default: return "fas fa-info-circle";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "counseling": return "text-primary";
      case "support_group": return "text-accent";
      case "wellness": return "text-green-500";
      case "crisis": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8" data-testid="services-page">
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
    <main className="max-w-6xl mx-auto px-4 py-8" data-testid="services-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Campus Mental Health Services</h1>
        <p className="text-muted-foreground mb-6">
          Discover the mental health resources available on your campus. All services are confidential 
          and designed to support your academic success and personal wellbeing.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" data-testid="tab-all-services">All Services</TabsTrigger>
          <TabsTrigger value="counseling" data-testid="tab-counseling">Counseling</TabsTrigger>
          <TabsTrigger value="support_group" data-testid="tab-support-groups">Support Groups</TabsTrigger>
          <TabsTrigger value="wellness" data-testid="tab-wellness">Wellness</TabsTrigger>
          <TabsTrigger value="crisis" data-testid="tab-crisis">Crisis Support</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="all-services-grid">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <i className={`${getTypeIcon(service.type)} ${getTypeColor(service.type)} text-2xl`}></i>
                    <Badge variant="secondary" className="text-xs">
                      {service.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg" data-testid={`service-name-${service.id}`}>
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm" data-testid={`service-description-${service.id}`}>
                    {service.description}
                  </p>

                  {service.availability && (
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="fas fa-clock text-muted-foreground"></i>
                      <span data-testid={`service-availability-${service.id}`}>{service.availability}</span>
                    </div>
                  )}

                  {service.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="fas fa-map-marker-alt text-muted-foreground"></i>
                      <span data-testid={`service-location-${service.id}`}>{service.location}</span>
                    </div>
                  )}

                  {service.contact && (
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="fas fa-phone text-muted-foreground"></i>
                      <span data-testid={`service-contact-${service.id}`}>{service.contact}</span>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    {service.bookingUrl ? (
                      <Button className="w-full" data-testid={`button-book-${service.id}`}>
                        <i className="fas fa-calendar mr-2"></i>Book Appointment
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" data-testid={`button-learn-more-${service.id}`}>
                        <i className="fas fa-info-circle mr-2"></i>Learn More
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <i className="fas fa-building text-4xl text-muted-foreground mb-4"></i>
                <h3 className="font-semibold mb-2">No services available</h3>
                <p className="text-muted-foreground">
                  Campus services information is being updated. Please check back soon.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {["counseling", "support_group", "wellness", "crisis"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid={`${type}-services-grid`}>
              {getServicesByType(type).map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <i className={`${getTypeIcon(service.type)} ${getTypeColor(service.type)} text-2xl`}></i>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{service.description}</p>

                    <div className="space-y-2">
                      {service.availability && (
                        <div className="flex items-center space-x-2 text-sm">
                          <i className="fas fa-clock text-muted-foreground"></i>
                          <span>{service.availability}</span>
                        </div>
                      )}

                      {service.location && (
                        <div className="flex items-center space-x-2 text-sm">
                          <i className="fas fa-map-marker-alt text-muted-foreground"></i>
                          <span>{service.location}</span>
                        </div>
                      )}

                      {service.contact && (
                        <div className="flex items-center space-x-2 text-sm">
                          <i className="fas fa-phone text-muted-foreground"></i>
                          <span>{service.contact}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex gap-2">
                      {service.bookingUrl ? (
                        <Button className="flex-1">
                          <i className="fas fa-calendar mr-2"></i>Book Appointment
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1">
                          <i className="fas fa-info-circle mr-2"></i>Learn More
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <i className="fas fa-share"></i>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getServicesByType(type).length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <i className={`${getTypeIcon(type)} text-4xl text-muted-foreground mb-4`}></i>
                  <h3 className="font-semibold mb-2">No {type.replace('_', ' ')} services available</h3>
                  <p className="text-muted-foreground">
                    This type of service is not currently available or information is being updated.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-primary">
              <i className="fas fa-info-circle mr-2"></i>How to Access Services
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-primary">1.</span>
                <span>Choose the service that best fits your needs</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-primary">2.</span>
                <span>Contact the service directly or use the booking link</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-primary">3.</span>
                <span>All services are confidential and often free for students</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-primary">4.</span>
                <span>Bring your student ID and any insurance information</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 text-accent">
              <i className="fas fa-heart mr-2"></i>What to Expect
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Professional, trained staff who understand student life</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Confidential services protected by privacy laws</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Flexible scheduling around your academic commitments</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-accent mt-1"></i>
                <span>Culturally sensitive and inclusive approaches</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
