import WelcomeHero from "@/components/dashboard/welcome-hero";
import QuickStats from "@/components/dashboard/quick-stats";
import AssessmentTools from "@/components/assessment/assessment-tools";
import MoodTracking from "@/components/tracking/mood-tracking";
import CommunityForum from "@/components/community/community-forum";
import CrisisResources from "@/components/sidebar/crisis-resources";
import CampusServices from "@/components/sidebar/campus-services";
import ResourceLibrary from "@/components/sidebar/resource-library";

export default function Dashboard() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8" data-testid="dashboard-page">
      <WelcomeHero />
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AssessmentTools />
          <MoodTracking />
          <CommunityForum />
        </div>
        
        <div className="space-y-8">
          <CrisisResources />
          <CampusServices />
          <ResourceLibrary />
        </div>
      </div>
    </main>
  );
}
