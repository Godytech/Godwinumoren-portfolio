import React, { useState } from "react";
import { useFirestoreDoc } from "../../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../../data/initialData";
import { AboutContent } from "../../../types";
import { Save, RotateCcw, Check, Plus, Trash2 } from "lucide-react";

export const AboutAdmin: React.FC = () => {
  const { data: about, updateDocData, resetToDefault } = useFirestoreDoc<AboutContent>(
    "content",
    "about",
    initialPortfolioData.about
  );

  const [form, setForm] = useState<AboutContent>(about);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setForm(about);
  }, [about]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDocData(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const nextStats = [...form.stats];
    nextStats[index] = { ...nextStats[index], [field]: value };
    setForm({ ...form, stats: nextStats });
  };

  const addStat = () => {
    setForm({
      ...form,
      stats: [
        ...form.stats,
        { id: `stat-${Date.now()}`, icon: "Layout", label: "Metric Label", value: "100+" },
      ],
    });
  };

  const removeStat = (index: number) => {
    setForm({
      ...form,
      stats: form.stats.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">About Section Settings</h2>
          <p className="text-sm text-muted-foreground">
            Edit biography, personal mission statement, and key metric counters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetToDefault();
              setForm(initialPortfolioData.about);
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Heading Prefix</label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Passionate about"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gradient Highlight Text</label>
            <input
              type="text"
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Digital Excellence"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Main Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Stats Grid */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Key Metrics & Stats Cards</h3>
            <button
              type="button"
              onClick={addStat}
              className="px-3.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.stats.map((stat, i) => (
              <div key={stat.id || i} className="p-4 rounded-2xl border border-foreground/15 bg-background/50 space-y-3 relative group">
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors p-1"
                  title="Remove Stat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Value (e.g. 10+)</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(i, "value", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-foreground/15 bg-background text-sm font-bold text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Icon (Code2, Users...)</label>
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => handleStatChange(i, "icon", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-foreground/15 bg-background text-xs font-medium text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(i, "label", e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-foreground/15 bg-background text-xs font-semibold text-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
