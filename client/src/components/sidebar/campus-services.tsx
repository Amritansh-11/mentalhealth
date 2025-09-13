import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampusService } from "@shared/schema";

export default function CampusServices() {
  const { data: services = [] } = useQuery<CampusService[]>({
    queryKey: ["/api/campus-services"],
  });

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "counseling": return "fas fa-user-md";
      case "support_group": return "fas fa-users";
      case "wellness": return "fas fa-leaf";
      case "crisis": return "fas fa-exclamation-triangle";
      default: return "fas fa-info-circle";
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "counseling": return "text-primary";
      case "support_group": return "text-accent";
      case "wellness": return "text-green-500";
      case "crisis": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const priorityServices = services.slice(0, 3);

  return (
    <section data-testid="campus-services">
      <h3 className="text-lg font-bold mb-4 text-card-foreground">Campus Mental Health Services</h3>
      <div className="space-y-4">
        {priorityServices.map((service) => (
          <Card key={service.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <i className={`${getServiceIcon(service.type)} ${getServiceColor(service.type)} text-lg mt-1`}></i>
                <div className="flex-1">
                  <h4 className="font-semibold text-card-foreground mb-1" data-testid={`service-name-${service.id}`}>
                    {service.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`service-description-${service.id}`}>
                    {service.description}
                  </p>
                  
                  {service.availability && (
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <i className="fas fa-clock mr-1"></i>
                      <span data-testid={`service-availability-${service.id}`}>{service.availability}</span>
                    </div>
                  )}

                  {service.location && (
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      <span data-testid={`service-location-${service.id}`}>{service.location}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    size="sm"
                    variant={service.bookingUrl ? "default" : "outline"}
                    data-testid={`button-${service.bookingUrl ? 'book' : 'learn-more'}-${service.id}`}
                  >
                    <i className={`fas ${service.bookingUrl ? 'fa-calendar' : 'fa-info-circle'} mr-2`}></i>
                    {service.bookingUrl ? "Book Appointment" : "Learn More"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {services.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <i className="fas fa-building text-3xl text-muted-foreground mb-3"></i>
              <p className="text-sm text-muted-foreground">
                Campus services are being loaded...
              </p>
            </CardContent>
          </Card>
        )}

        {services.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full"
            data-testid="button-view-all-services"
          >
            <i className="fas fa-building mr-2"></i>View All Services
          </Button>
        )}
      </div>
    </section>
  );
}
