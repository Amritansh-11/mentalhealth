import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ASSESSMENT_TYPES } from "@/types";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AssessmentTools from "@/components/assessment/assessment-tools";

export default function Assessment() {
  const { type } = useParams();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getAnonymousSession();

  const assessment = type ? ASSESSMENT_TYPES[type] : null;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/assessments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment Completed",
        description: "Your assessment has been saved anonymously.",
      });
    },
  });

  if (!assessment) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8" data-testid="assessment-page">
        <h1 className="text-3xl font-bold mb-8">Self-Assessment Tools</h1>
        <AssessmentTools />
      </main>
    );
  }

  const currentQuestionData = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setResponses({
      ...responses,
      [currentQuestionData.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.entries(responses).forEach(([questionId, answer]) => {
      totalScore += assessment.scoringKey[answer] || 0;
    });
    return totalScore;
  };

  const getSeverityLevel = (score: number, type: string) => {
    switch (type) {
      case "anxiety":
        if (score <= 4) return "Minimal";
        if (score <= 9) return "Mild";
        if (score <= 14) return "Moderate";
        return "Severe";
      case "depression":
        // PHQ-9 standard thresholds
        if (score <= 4) return "Minimal";
        if (score <= 9) return "Mild";
        if (score <= 14) return "Moderate";
        if (score <= 19) return "Moderately Severe";
        return "Severe";
      case "stress":
        // Fixed thresholds for 4-question assessment (max score 16)
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
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const severity = getSeverityLevel(score, assessment.id);

    try {
      await mutation.mutateAsync({
        sessionId: session.id,
        type: assessment.id,
        responses,
        score,
        severity,
      });
      setShowResults(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showResults) {
    const score = calculateScore();
    const severity = getSeverityLevel(score, assessment.id);
    
    return (
      <main className="max-w-4xl mx-auto px-4 py-8" data-testid="assessment-results">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <i className={`${assessment.icon} text-primary`}></i>
              <span>{assessment.name} Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-assessment-score">
                {score}/{assessment.id === 'stress' ? assessment.questions.length * 4 : assessment.questions.length * 3}
              </div>
              <div className="text-xl font-semibold mb-4" data-testid="text-assessment-severity">
                {severity} {assessment.id}
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What this means:</h4>
              <p className="text-sm text-muted-foreground">
                This assessment provides a snapshot of your current symptoms. 
                Results are anonymous and stored securely. Consider discussing 
                these results with a mental health professional for proper evaluation.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setLocation("/resources")} data-testid="button-view-resources">
                <i className="fas fa-book mr-2"></i>View Resources
              </Button>
              <Button variant="outline" onClick={() => setLocation("/services")} data-testid="button-campus-services">
                <i className="fas fa-map-marker-alt mr-2"></i>Campus Services
              </Button>
              <Button variant="outline" onClick={() => setLocation("/assessment")} data-testid="button-another-assessment">
                Take Another Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const isAnswered = responses[currentQuestionData.id] !== undefined;
  const canProceed = isAnswered;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8" data-testid="assessment-form">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/assessment")}
            data-testid="button-back-to-assessments"
          >
            <i className="fas fa-arrow-left mr-2"></i>Back to Assessments
          </Button>
          <div className="flex items-center space-x-2">
            <i className={`${assessment.icon} text-primary`}></i>
            <h1 className="text-2xl font-bold">{assessment.name}</h1>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {assessment.questions.length}
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6" data-testid="text-question">
            {currentQuestionData.question}
          </h2>
          
          <RadioGroup
            value={responses[currentQuestionData.id] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
            data-testid="radio-group-answers"
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          data-testid="button-previous"
        >
          <i className="fas fa-chevron-left mr-2"></i>Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed || mutation.isPending}
          data-testid="button-next"
        >
          {mutation.isPending ? (
            "Saving..."
          ) : currentQuestion === assessment.questions.length - 1 ? (
            "Complete Assessment"
          ) : (
            <>
              Next<i className="fas fa-chevron-right ml-2"></i>
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
