import React, { useState } from "react";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { HeroContent } from "../../types";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { ThemeToggle } from "../../components/lightswind/theme-toggle";

export default function Login() {
  const { data: hero } = useFirestoreDoc<HeroContent>(
    "content",
    "hero",
    initialPortfolioData.hero
  );
  const { login } = useAuth();
  const navigate = useNavigate();
  const displayName = hero.name || initialPortfolioData.hero.name;
  const avatarUrl = hero.avatarUrl || initialPortfolioData.hero.avatarUrl;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-6 relative overflow-hidden"
      style={{
        "--icon-accent": hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor,
      } as React.CSSProperties}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto z-10">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-sm text-foreground hover:text-primary transition-colors">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span>{displayName}</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-12 z-10">
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-foreground/10 shadow-2xl relative overflow-hidden">
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-primary to-sky-400 p-[1.5px] shadow-lg mb-4">
              <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center text-primary">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Admin CMS Portal
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              Manage live portfolio content, projects, timeline, and media in real-time.
            </p>

          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-foreground/15 bg-foreground/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                  placeholder="admin@scarlettrose.dev"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-foreground/15 bg-foreground/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all cursor-pointer mt-6 active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-muted-foreground z-10">
        <span>Portfolio For • Godwin Umoren</span>
      </div>
    </div>
  );
}
