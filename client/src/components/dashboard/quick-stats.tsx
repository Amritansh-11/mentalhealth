import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { MoodEntry, Assessment } from "@shared/schema";

export default function QuickStats() {
  const session = getAnonymousSession();

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", session.id],
  });

  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments", session.id],
  });

  const currentMood = moodEntries[0]?.mood || 0;
  const sleepHours = moodEntries[0]?.sleepHours || 0;
  const streakDays = moodEntries.length;
  const assessmentCount = assessments.length;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    if (mood >= 2) return "😔";
    return "😞";
  };

  return (
    <section className="mb-12" data-testid="quick-stats">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">Current Mood</h3>
              <span className="text-xl">{getMoodEmoji(currentMood)}</span>
            </div>
            <div className="text-2xl font-bold text-accent" data-testid="text-current-mood">
              {currentMood > 0 ? `${currentMood}/10` : "Not set"}
            </div>
            <p className="text-muted-foreground text-sm">
              {currentMood >= 6 ? "Feeling good today" : currentMood > 0 ? "Could be better" : "Add your first mood entry"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">Streak</h3>
              <i className="fas fa-fire text-orange-500 text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-orange-500" data-testid="text-streak-days">
              {streakDays} days
            </div>
            <p className="text-muted-foreground text-sm">
              {streakDays > 0 ? "Keep it up!" : "Start your tracking journey"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">Sleep Quality</h3>
              <i className="fas fa-moon text-primary text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-primary" data-testid="text-sleep-hours">
              {sleepHours > 0 ? `${sleepHours} hrs` : "Not set"}
            </div>
            <p className="text-muted-foreground text-sm">
              {sleepHours >= 7 ? "Good sleep!" : sleepHours > 0 ? "Could improve" : "Track your sleep"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground">Assessments</h3>
              <i className="fas fa-chart-line text-accent text-xl"></i>
            </div>
            <div className="text-2xl font-bold text-accent" data-testid="text-assessment-count">
              {assessmentCount}
            </div>
            <p className="text-muted-foreground text-sm">
              {assessmentCount > 0 ? "Completed total" : "Take your first assessment"}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
