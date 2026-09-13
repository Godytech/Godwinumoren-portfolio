import React, { useState } from "react";
import { Check, Megaphone, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useFirestoreDoc } from "../../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../../data/initialData";
import { FooterContent } from "../../../types";

export const FooterAdmin: React.FC = () => {
  const { data: footer, updateDocData, resetToDefault } = useFirestoreDoc<FooterContent>(
    "content",
    "footer",
    initialPortfolioData.footer
  );
  const [form, setForm] = useState<FooterContent>(() => ({
    ...footer,
    animatedTexts: footer.animatedTexts?.length
      ? footer.animatedTexts
      : initialPortfolioData.footer.animatedTexts,
  }));
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setForm({
      ...footer,
      animatedTexts: footer.animatedTexts?.length
        ? footer.animatedTexts
        : initialPortfolioData.footer.animatedTexts,
    });
  }, [footer]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateDocData(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetToDefault();
    setForm(initialPortfolioData.footer);
  };

  const updateAnimatedText = (index: number, value: string) => {
    const animatedTexts = [...form.animatedTexts];
    animatedTexts[index] = value;
    setForm({ ...form, animatedTexts });
  };

  const addAnimatedText = () => {
    setForm({ ...form, animatedTexts: [...form.animatedTexts, "New animated phrase"] });
  };

  const removeAnimatedText = (index: number) => {
    if (form.animatedTexts.length <= 1) return;
    setForm({
      ...form,
      animatedTexts: form.animatedTexts.filter((_, textIndex) => textIndex !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            <span>Footer Banner Settings</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Edit the short banner label displayed above the footer animation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="submit"
            form="footer-settings-form"
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Saved Changes" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form id="footer-settings-form" onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Banner Label
          </label>
          <input
            type="text"
            value={form.bannerLabel}
            onChange={(event) => setForm({ ...form, bannerLabel: event.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Innovate & Build"
            maxLength={60}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Animated Phrases
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                These phrases rotate beneath the banner label.
              </p>
            </div>
            <button
              type="button"
              onClick={addAnimatedText}
              className="px-3 py-1.5 rounded-lg border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Phrase
            </button>
          </div>

          <div className="space-y-2">
            {form.animatedTexts.map((text, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(event) => updateAnimatedText(index, event.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder={`Animated phrase ${index + 1}`}
                  maxLength={80}
                />
                <button
                  type="button"
                  onClick={() => removeAnimatedText(index)}
                  disabled={form.animatedTexts.length <= 1}
                  className="p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label={`Remove animated phrase ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
