import { Link, useLocation } from "wouter";
import { getAnonymousSession } from "@/lib/anonymous-session";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = getAnonymousSession();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/assessment", label: "Assessment" },
    { path: "/resources", label: "Resources" },
    { path: "/community", label: "Community" },
    { path: "/tracking", label: "Tracking" },
    { path: "/services", label: "Campus Services" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="bg-card shadow-sm border-b border-border" data-testid="header">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="logo-link">
              <h1 className="text-2xl font-bold text-primary">
                <i className="fas fa-heart mr-2"></i>MindBridge
              </h1>
            </Link>
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full" data-testid="anonymous-user-id">
              <i className="fas fa-user-secret mr-1"></i>Anonymous User #{session.anonymousId}
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-6" data-testid="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-primary font-medium border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                } transition-colors`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="md:hidden">
            <button
              className="text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4" data-testid="mobile-nav">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 px-4 rounded ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  } transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
