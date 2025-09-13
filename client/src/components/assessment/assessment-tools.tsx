import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_TYPES } from "@/types";

export default function AssessmentTools() {
  const assessmentTypes = Object.values(ASSESSMENT_TYPES);

  const getIconColor = (type: string) => {
    switch (type) {
      case "anxiety": return "text-primary";
      case "depression": return "text-blue-500";
      case "stress": return "text-orange-500";
      case "sleep": return "text-purple-500";
      default: return "text-primary";
    }
  };

  return (
    <section data-testid="assessment-tools">
      <h3 className="text-2xl font-bold mb-6 text-card-foreground">Anonymous Self-Assessment Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentTypes.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-card-foreground">{assessment.name}</h4>
                <i className={`${assessment.icon} ${getIconColor(assessment.id)} text-xl`}></i>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">{assessment.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{assessment.duration}</span>
                <Link href={`/assessment/${assessment.id}`}>
                  <Button 
                    size="sm" 
                    data-testid={`button-start-${assessment.id}-assessment`}
                  >
                    Start Assessment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
