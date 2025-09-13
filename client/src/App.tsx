import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAnonymousSession } from "@/lib/anonymous-session";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Tracking from "@/pages/tracking";
import Services from "@/pages/services";
import Header from "@/components/layout/header";
import CrisisBanner from "@/components/layout/crisis-banner";
import { useEffect } from "react";
import Bot from './chatbot/Bot'
function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assessment/:type?" component={Assessment} />
      <Route path="/resources" component={Resources} />
      <Route path="/community" component={Community} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/services" component={Services} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize anonymous session
    getAnonymousSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <CrisisBanner />
          <Header />
          <Bot/>
          <Router />
          <footer className="bg-muted mt-16 py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <i className="fas fa-shield-alt text-primary"></i>
                  <span className="text-sm text-muted-foreground">Your data is encrypted and completely anonymous</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  MindBridge is not a substitute for professional medical advice, diagnosis, or treatment. 
                  If you are experiencing a mental health emergency, please contact emergency services immediately.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                  <a href="#privacy" className="hover:text-primary">Privacy Policy</a>
                  <a href="#terms" className="hover:text-primary">Terms of Service</a>
                  <a href="#contact" className="hover:text-primary">Contact Support</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
