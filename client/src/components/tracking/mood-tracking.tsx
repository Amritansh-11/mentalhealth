import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MoodEntry } from "@shared/schema";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MoodTracking() {
  const [mood, setMood] = useState([5]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = getAnonymousSession();

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", session.id],
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/mood-entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      toast({
        title: "Mood Entry Added",
        description: "Your mood has been tracked anonymously.",
      });
      setDialogOpen(false);
      setNotes("");
    },
  });

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        sessionId: session.id,
        mood: mood[0],
        stressLevel: stressLevel[0],
        sleepHours,
        notes: notes.trim() || null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue >= 9) return "😄";
    if (moodValue >= 7) return "😊";
    if (moodValue >= 5) return "🙂";
    if (moodValue >= 3) return "😐";
    if (moodValue >= 2) return "😔";
    return "😞";
  };

  const chartData = moodEntries.slice(0, 7).reverse().map((entry, index) => ({
    day: `Day ${index + 1}`,
    mood: entry.mood,
    stress: entry.stressLevel,
  }));

  return (
    <section data-testid="mood-tracking">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-card-foreground">Mood Tracking & Journal</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-primary hover:text-primary/80 text-sm font-medium" data-testid="button-add-mood-entry">
              <i className="fas fa-plus mr-2"></i>Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Mood Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">How are you feeling today? {getMoodEmoji(mood[0])}</Label>
                <div className="mt-2">
                  <Slider
                    value={mood}
                    onValueChange={setMood}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid="slider-mood"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Very Bad</span>
                    <span>{mood[0]}/10</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Stress Level</Label>
                <div className="mt-2">
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid="slider-stress"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Very Low</span>
                    <span>{stressLevel[0]}/10</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="sleep-hours" className="text-sm font-medium">Hours of Sleep</Label>
                <Input
                  id="sleep-hours"
                  type="number"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="mt-1"
                  data-testid="input-sleep-hours"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How was your day? Any thoughts or feelings you'd like to record..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="w-full"
                data-testid="button-submit-mood-entry"
              >
                {mutation.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Weekly Mood Trend</h4>
              <div className="chart-container bg-muted rounded-lg p-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[1, 10]} />
                      <Line type="monotone" dataKey="mood" stroke="hsl(221.2, 83.2%, 53.3%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <i className="fas fa-chart-line text-4xl mb-2"></i>
                      <p>No mood data yet</p>
                      <p className="text-xs">Add your first mood entry to see trends</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Recent Journal Entries</h4>
              <div className="space-y-3" data-testid="recent-journal-entries">
                {moodEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <span className="font-medium text-sm text-secondary-foreground">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Today"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now"}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-secondary-foreground line-clamp-2">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ))}
                
                {moodEntries.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <i className="fas fa-journal-whills text-3xl mb-2"></i>
                    <p>No journal entries yet</p>
                    <p className="text-xs">Start tracking your mood to build your personal journal</p>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {/* Navigate to full tracking page */}}
                data-testid="button-view-all-entries"
              >
                View All Entries
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
