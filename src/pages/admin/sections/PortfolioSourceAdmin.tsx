import React, { useState, useEffect } from "react";
import { initialPortfolioData } from "../../../data/initialData";
import { isFirebaseConfigured, savePortfolioSource } from "../../../lib/firebase";
import {
  Code2,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  FileCode,
  Layers,
  Cpu,
  Database,
  Sparkles,
} from "lucide-react";

export const PortfolioSourceAdmin: React.FC = () => {
  const [sourceJson, setSourceJson] = useState("");
  const [editedJson, setEditedJson] = useState("");
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadFullSource = () => {
    try {
      const hero = JSON.parse(
        localStorage.getItem("portfolio_cms_content_hero") ||
          JSON.stringify(initialPortfolioData.hero)
      );
      const about = JSON.parse(
        localStorage.getItem("portfolio_cms_content_about") ||
          JSON.stringify(initialPortfolioData.about)
      );
      const services = JSON.parse(
        localStorage.getItem("portfolio_cms_services") ||
          JSON.stringify(initialPortfolioData.services)
      );
      const projects = JSON.parse(
        localStorage.getItem("portfolio_cms_projects") ||
          JSON.stringify(initialPortfolioData.projects)
      );
      const career = JSON.parse(
        localStorage.getItem("portfolio_cms_career") ||
          JSON.stringify(initialPortfolioData.career)
      );
      const education = JSON.parse(
        localStorage.getItem("portfolio_cms_education") ||
          JSON.stringify(initialPortfolioData.education)
      );
      const skills = JSON.parse(
        localStorage.getItem("portfolio_cms_skills") ||
          JSON.stringify(initialPortfolioData.skills)
      );
      const testimonials = JSON.parse(
        localStorage.getItem("portfolio_cms_testimonials") ||
          JSON.stringify(initialPortfolioData.testimonials)
      );
      const contact = JSON.parse(
        localStorage.getItem("portfolio_cms_content_contact") ||
          JSON.stringify(initialPortfolioData.contact)
      );

      const fullData = {
        hero,
        about,
        services,
        projects,
        career,
        education,
        skills,
        testimonials,
        contact,
      };

      const formatted = JSON.stringify(fullData, null, 2);
      setSourceJson(formatted);
      setEditedJson(formatted);
    } catch {
      const def = JSON.stringify(initialPortfolioData, null, 2);
      setSourceJson(def);
      setEditedJson(def);
    }
  };

  useEffect(() => {
    loadFullSource();
    window.addEventListener("portfolio_content_updated", loadFullSource);
    return () => window.removeEventListener("portfolio_content_updated", loadFullSource);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setFeedback({ type: "success", text: "Portfolio source copied to clipboard!" });
    } catch {
      setFeedback({ type: "error", text: "Failed to copy to clipboard." });
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([editedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-source-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback({ type: "success", text: "Portfolio source JSON downloaded!" });
    } catch {
      setFeedback({ type: "error", text: "Download failed." });
    }
  };

  const handleApplySource = async () => {
    try {
      const parsed = JSON.parse(editedJson);

      if (isFirebaseConfigured) {
        await savePortfolioSource(parsed);
      }

      if (parsed.hero) localStorage.setItem("portfolio_cms_content_hero", JSON.stringify(parsed.hero));
      if (parsed.about) localStorage.setItem("portfolio_cms_content_about", JSON.stringify(parsed.about));
      if (parsed.services) localStorage.setItem("portfolio_cms_services", JSON.stringify(parsed.services));
      if (parsed.projects) localStorage.setItem("portfolio_cms_projects", JSON.stringify(parsed.projects));
      if (parsed.career) localStorage.setItem("portfolio_cms_career", JSON.stringify(parsed.career));
      if (parsed.education) localStorage.setItem("portfolio_cms_education", JSON.stringify(parsed.education));
      if (parsed.skills) localStorage.setItem("portfolio_cms_skills", JSON.stringify(parsed.skills));
      if (parsed.testimonials) localStorage.setItem("portfolio_cms_testimonials", JSON.stringify(parsed.testimonials));
      if (parsed.contact) localStorage.setItem("portfolio_cms_content_contact", JSON.stringify(parsed.contact));

      window.dispatchEvent(new Event("portfolio_content_updated"));
      setFeedback({ type: "success", text: "Portfolio source updated and synchronized successfully!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: `Invalid JSON format: ${err.message}` });
    }
  };

  const handleResetFactory = async () => {
    try {
      if (isFirebaseConfigured) {
        await savePortfolioSource(initialPortfolioData);
      }

    localStorage.setItem("portfolio_cms_content_hero", JSON.stringify(initialPortfolioData.hero));
    localStorage.setItem("portfolio_cms_content_about", JSON.stringify(initialPortfolioData.about));
    localStorage.setItem("portfolio_cms_services", JSON.stringify(initialPortfolioData.services));
    localStorage.setItem("portfolio_cms_projects", JSON.stringify(initialPortfolioData.projects));
    localStorage.setItem("portfolio_cms_career", JSON.stringify(initialPortfolioData.career));
    localStorage.setItem("portfolio_cms_education", JSON.stringify(initialPortfolioData.education));
    localStorage.setItem("portfolio_cms_skills", JSON.stringify(initialPortfolioData.skills));
    localStorage.setItem("portfolio_cms_testimonials", JSON.stringify(initialPortfolioData.testimonials));
    localStorage.setItem("portfolio_cms_content_contact", JSON.stringify(initialPortfolioData.contact));

    window.dispatchEvent(new Event("portfolio_content_updated"));
    loadFullSource();
    setFeedback({ type: "success", text: "Reset all portfolio source content to factory defaults!" });
    } catch (err) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : String(err) });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          JSON.parse(content); // validate JSON syntax
          setEditedJson(content);
          setFeedback({ type: "success", text: "Uploaded JSON parsed successfully. Click 'Apply Source JSON' to activate." });
        } catch {
          setFeedback({ type: "error", text: "Uploaded file is not a valid JSON document." });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FileCode className="w-6 h-6 text-primary" />
            <span>Portfolio Source & Architecture</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Inspect, export, edit, and synchronize the entire portfolio source data structure.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetFactory}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl border border-primary/25 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy JSON"}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-foreground/5 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handleApplySource}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Source JSON</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {feedback.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tech Stack Language & Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-foreground/10 bg-card/60 space-y-1.5">
          <div className="flex items-center gap-2 text-primary">
            <Code2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Language</span>
          </div>
          <p className="text-base font-bold text-foreground">TypeScript 5.8</p>
          <p className="text-xs text-muted-foreground">Strict typing, modular interfaces</p>
        </div>

        <div className="p-4 rounded-2xl border border-foreground/10 bg-card/60 space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Framework</span>
          </div>
          <p className="text-base font-bold text-foreground">React 19 + Vite</p>
          <p className="text-xs text-muted-foreground">Ultra-fast SPA bundling</p>
        </div>

        <div className="p-4 rounded-2xl border border-foreground/10 bg-card/60 space-y-1.5">
          <div className="flex items-center gap-2 text-foreground">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Styling</span>
          </div>
          <p className="text-base font-bold text-foreground">Tailwind CSS v4</p>
          <p className="text-xs text-muted-foreground">Native dark theme variant tokens</p>
        </div>

        <div className="p-4 rounded-2xl border border-foreground/10 bg-card/60 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Database className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Database</span>
          </div>
          <p className="text-base font-bold text-foreground">Firestore & Local</p>
          <p className="text-xs text-muted-foreground">Live reactivity across tabs</p>
        </div>
      </div>

      {/* JSON Source Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <span>Live Portfolio JSON Data Source</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Validated Schema
            </span>
          </label>

          <label className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1 font-medium">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload JSON File</span>
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="relative rounded-2xl border border-foreground/15 overflow-hidden bg-neutral-950 shadow-inner">
          <textarea
            value={editedJson}
            onChange={(e) => setEditedJson(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full p-4 font-mono text-xs text-emerald-400 bg-transparent focus:outline-none resize-y leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>You can paste updated JSON above and click "Apply Source JSON" to push changes to the public portfolio.</span>
          <button
            type="button"
            onClick={() => setEditedJson(sourceJson)}
            className="text-primary hover:underline cursor-pointer"
          >
            Revert Unsaved Text
          </button>
        </div>
      </div>
    </div>
  );
};
