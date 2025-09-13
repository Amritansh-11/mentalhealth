import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function WelcomeHero() {
  return (
    <section className="mb-12" data-testid="welcome-hero">
      <div className="mood-gradient rounded-xl p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Welcome back to your safe space</h2>
          <p className="text-white/90 mb-6">
            Your privacy is protected. Everything here is completely anonymous and confidential. 
            Take your time, and remember that seeking support is a sign of strength.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/assessment">
              <Button className="bg-white text-primary hover:bg-white/90" data-testid="button-quick-assessment">
                <i className="fas fa-clipboard-check mr-2"></i>Quick Assessment
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              data-testid="button-crisis-resources"
            >
              <i className="fas fa-phone mr-2"></i>Crisis Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
