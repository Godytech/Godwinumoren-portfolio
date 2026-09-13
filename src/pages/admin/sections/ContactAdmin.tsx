import React, { useState } from "react";
import { useFirestoreDoc } from "../../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../../data/initialData";
import { ContactContent } from "../../../types";
import { Save, RotateCcw, Check } from "lucide-react";

export const ContactAdmin: React.FC = () => {
  const { data: contact, updateDocData, resetToDefault } = useFirestoreDoc<ContactContent>(
    "content",
    "contact",
    initialPortfolioData.contact
  );

  const [form, setForm] = useState<ContactContent>(contact);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setForm(contact);
  }, [contact]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSocialLinks = [
      { id: "soc-1", platform: "Twitter", url: form.twitter || "https://twitter.com" },
      { id: "soc-2", platform: "GitHub", url: form.github || "https://github.com" },
      { id: "soc-3", platform: "LinkedIn", url: form.linkedin || "https://linkedin.com" },
      { id: "soc-4", platform: "Email", url: `mailto:${form.email || "hello@scarlettrose.dev"}` },
    ];
    const payload = {
      ...form,
      socialLinks: updatedSocialLinks,
    };
    await updateDocData(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Contact & Direct Channels</h2>
          <p className="text-sm text-muted-foreground">
            Update email address, telephone contact, geographic office location, and social handles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetToDefault();
              setForm(initialPortfolioData.contact);
            }}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Saved Changes" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Heading Headline</label>
          <input
            type="text"
            value={form.headline || ""}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Let's build something"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Direct Email Address</label>
          <input
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="hello@scarlettrose.dev"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
          <input
            type="text"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="+1 (555) 019-2834"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location / Office City</label>
          <input
            type="text"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="San Francisco, California"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Invitation Subheadline</label>
          <textarea
            rows={3}
            value={form.subheadline || ""}
            onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
            className="w-full p-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">GitHub URL</label>
          <input
            type="text"
            value={form.github || ""}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">LinkedIn URL</label>
          <input
            type="text"
            value={form.linkedin || ""}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Twitter / X URL</label>
          <input
            type="text"
            value={form.twitter || ""}
            onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};
