import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { MoodEntry, Assessment } from "@shared/schema";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, PieChart, Pie, Cell } from "recharts";

export default function Tracking() {
  const [timeRange, setTimeRange] = useState("7");
  const session = getAnonymousSession();

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", session.id],
  });

  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments", session.id],
  });

  const filteredEntries = moodEntries.slice(0, parseInt(timeRange));

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue >= 9) return "😄";
    if (moodValue >= 7) return "😊";
    if (moodValue >= 5) return "🙂";
    if (moodValue >= 3) return "😐";
    if (moodValue >= 2) return "😔";
    return "😞";
  };

  const moodChartData = filteredEntries.reverse().map((entry, index) => ({
    date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : `Day ${index + 1}`,
    mood: entry.mood,
    stress: entry.stressLevel,
    sleep: entry.sleepHours,
  }));

  const assessmentChartData = assessments.reduce((acc: any[], assessment) => {
    const existing = acc.find(item => item.type === assessment.type);
    if (existing) {
      existing.count += 1;
      existing.avgScore = (existing.avgScore + assessment.score) / 2;
    } else {
      acc.push({
        type: assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1),
        count: 1,
        avgScore: assessment.score,
      });
    }
    return acc;
  }, []);

  const sleepQualityData = [
    { name: "Good (7+ hrs)", value: filteredEntries.filter(e => (e.sleepHours || 0) >= 7).length, color: "#10b981" },
    { name: "Fair (5-7 hrs)", value: filteredEntries.filter(e => (e.sleepHours || 0) >= 5 && (e.sleepHours || 0) < 7).length, color: "#f59e0b" },
    { name: "Poor (<5 hrs)", value: filteredEntries.filter(e => (e.sleepHours || 0) < 5).length, color: "#ef4444" },
  ].filter(item => item.value > 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8" data-testid="tracking-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mood Tracking & Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 2 weeks</SelectItem>
            <SelectItem value="30">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="mood" data-testid="tab-mood">Mood Trends</TabsTrigger>
          <TabsTrigger value="sleep" data-testid="tab-sleep">Sleep Analysis</TabsTrigger>
          <TabsTrigger value="assessments" data-testid="tab-assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent" data-testid="text-avg-mood">
                  {filteredEntries.length > 0 
                    ? (filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) / filteredEntries.length).toFixed(1)
                    : "N/A"
                  }/10
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {filteredEntries.length > 0 && getMoodEmoji(filteredEntries.reduce((sum, entry) => sum + entry.mood, 0) / filteredEntries.length)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Sleep</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid="text-avg-sleep">
                  {filteredEntries.length > 0 
                    ? (filteredEntries.reduce((sum, entry) => sum + (entry.sleepHours || 0), 0) / filteredEntries.length).toFixed(1)
                    : "N/A"
                  } hrs
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {filteredEntries.length} days tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stress Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500" data-testid="text-avg-stress">
                  {filteredEntries.length > 0 
                    ? (filteredEntries.reduce((sum, entry) => sum + (entry.stressLevel || 0), 0) / filteredEntries.length).toFixed(1)
                    : "N/A"
                  }/10
                </div>
                <p className="text-sm text-muted-foreground mt-2">Average stress</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood & Stress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {moodChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 10]} />
                      <Line type="monotone" dataKey="mood" stroke="hsl(221.2, 83.2%, 53.3%)" strokeWidth={2} name="Mood" />
                      <Line type="monotone" dataKey="stress" stroke="hsl(12, 76%, 61%)" strokeWidth={2} name="Stress" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <i className="fas fa-chart-line text-4xl mb-4"></i>
                      <p>No mood data available</p>
                      <p className="text-sm">Start tracking to see your trends</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Mood Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {moodChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 10]} />
                      <Bar dataKey="mood" fill="hsl(221.2, 83.2%, 53.3%)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <i className="fas fa-chart-bar text-4xl mb-4"></i>
                      <p>No mood data available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3" data-testid="recent-mood-entries">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <div className="font-medium">{entry.mood}/10</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Today"}
                          </div>
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground max-w-32 truncate">
                          "{entry.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { range: "9-10 (Excellent)", count: filteredEntries.filter(e => e.mood >= 9).length, color: "bg-green-500" },
                    { range: "7-8 (Good)", count: filteredEntries.filter(e => e.mood >= 7 && e.mood < 9).length, color: "bg-blue-500" },
                    { range: "5-6 (Okay)", count: filteredEntries.filter(e => e.mood >= 5 && e.mood < 7).length, color: "bg-yellow-500" },
                    { range: "3-4 (Poor)", count: filteredEntries.filter(e => e.mood >= 3 && e.mood < 5).length, color: "bg-orange-500" },
                    { range: "1-2 (Very Poor)", count: filteredEntries.filter(e => e.mood < 3).length, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.range} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                        <span className="text-sm">{item.range}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Hours Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {moodChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={moodChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Line type="monotone" dataKey="sleep" stroke="hsl(159, 61%, 54%)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <i className="fas fa-bed text-3xl mb-2"></i>
                        <p>No sleep data</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {sleepQualityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sleepQualityData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {sleepQualityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <i className="fas fa-chart-pie text-3xl mb-2"></i>
                        <p>No sleep data</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="assessment-history">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold capitalize">{assessment.type} Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          Score: {assessment.score} - {assessment.severity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {assessments.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <i className="fas fa-clipboard-list text-3xl mb-4"></i>
                    <p>No assessments completed yet</p>
                    <Button className="mt-4" data-testid="button-take-assessment">
                      <i className="fas fa-plus mr-2"></i>Take Your First Assessment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
