import React, { useState } from "react";
import { useFirestoreDoc } from "../../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../../data/initialData";
import { HeroContent } from "../../../types";
import { uploadProfileImage } from "../../../lib/firebase";
import {
  Save,
  RotateCcw,
  Check,
  Sparkles,
  Image as ImageIcon,
  Palette,
  CreditCard,
  Eye,
  X,
} from "lucide-react";

const cardColorPresets = [
  {
    name: "Neon Violet",
    dot: "bg-purple-500",
    gradientStart: "#6b21a8",
    gradientVia: "#7c3aed",
    gradientEnd: "#1e1b4b",
    accent: "#8b5cf6",
    avatarGlow: "#38bdf8",
    rope: "#27272a",
    nameColor1: "#8b5cf6",
    nameColor2: "#38bdf8",
  },
  {
    name: "Cyber Cyan",
    dot: "bg-sky-500",
    gradientStart: "#0369a1",
    gradientVia: "#0284c7",
    gradientEnd: "#082f49",
    accent: "#38bdf8",
    avatarGlow: "#22d3ee",
    rope: "#0c4a6e",
    nameColor1: "#0284c7",
    nameColor2: "#22d3ee",
  },
  {
    name: "Emerald Matrix",
    dot: "bg-emerald-500",
    gradientStart: "#047857",
    gradientVia: "#059669",
    gradientEnd: "#064e3b",
    accent: "#10b981",
    avatarGlow: "#34d399",
    rope: "#064e3b",
    nameColor1: "#10b981",
    nameColor2: "#34d399",
  },
  {
    name: "Sunset Amber",
    dot: "bg-amber-500",
    gradientStart: "#c2410c",
    gradientVia: "#ea580c",
    gradientEnd: "#451a03",
    accent: "#f97316",
    avatarGlow: "#fbbf24",
    rope: "#7c2d12",
    nameColor1: "#f97316",
    nameColor2: "#fbbf24",
  },
  {
    name: "Rose Velvet",
    dot: "bg-rose-500",
    gradientStart: "#be123c",
    gradientVia: "#e11d48",
    gradientEnd: "#4c0519",
    accent: "#fb7185",
    avatarGlow: "#f43f5e",
    rope: "#292524",
    nameColor1: "#fb7185",
    nameColor2: "#a855f7",
  },
  {
    name: "Electric Gold",
    dot: "bg-yellow-500",
    gradientStart: "#854d0e",
    gradientVia: "#ca8a04",
    gradientEnd: "#292524",
    accent: "#eab308",
    avatarGlow: "#fef08a",
    rope: "#1c1917",
    nameColor1: "#eab308",
    nameColor2: "#f97316",
  },
  {
    name: "Obsidian Slate",
    dot: "bg-slate-400",
    gradientStart: "#334155",
    gradientVia: "#1e293b",
    gradientEnd: "#020617",
    accent: "#94a3b8",
    avatarGlow: "#cbd5e1",
    rope: "#18181b",
    nameColor1: "#94a3b8",
    nameColor2: "#38bdf8",
  },
];

export const HeroAdmin: React.FC = () => {
  const { data: hero, error, updateDocData, resetToDefault } = useFirestoreDoc<HeroContent>(
    "content",
    "hero",
    initialPortfolioData.hero
  );

  const [form, setForm] = useState<HeroContent>(hero);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync state if remote data changes
  React.useEffect(() => {
    setForm(hero);
  }, [hero]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    try {
      let payload = form;
      if ((form.avatarUrl || "").startsWith("data:")) {
        const response = await fetch(form.avatarUrl);
        const blob = await response.blob();
        payload = { ...form, avatarUrl: await uploadProfileImage(blob) };
        setForm(payload);
      }
      await updateDocData(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
    }
  };

  const applyPreset = (preset: (typeof cardColorPresets)[0]) => {
    setForm((prev) => ({
      ...prev,
      cardHeaderGradientStart: preset.gradientStart,
      cardHeaderGradientVia: preset.gradientVia,
      cardHeaderGradientEnd: preset.gradientEnd,
      cardAccentColor: preset.accent,
      cardAvatarGlowColor: preset.avatarGlow,
      cardRopeColor: preset.rope,
      cardBadgeBgColor: `${preset.accent}20`,
      nameColor1: preset.nameColor1 || prev.nameColor1 || "#8b5cf6",
      nameColor2: preset.nameColor2 || prev.nameColor2 || "#06b6d4",
    }));
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.");
        return;
      }
      if (file.size >= 5 * 1024 * 1024) {
        setUploadError("Please select an image smaller than 5 MB.");
        return;
      }
      setUploadingAvatar(true);
      setUploadError(null);
      try {
        const avatarUrl = await uploadProfileImage(file);
        setForm((prev) => ({ ...prev, avatarUrl }));
        await updateDocData({ avatarUrl });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleClearAvatar = async () => {
    setUploadingAvatar(true);
    setUploadError(null);
    try {
      await updateDocData({ avatarUrl: "" });
      setForm((prev) => ({ ...prev, avatarUrl: "" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const activeCardName = form.cardName || form.name || "Scarlett Rose";
  const activeRope = form.cardRopeColor || "#27272a";
  const activeStart = form.cardHeaderGradientStart || "#6b21a8";
  const activeVia = form.cardHeaderGradientVia || "#7c3aed";
  const activeEnd = form.cardHeaderGradientEnd || "#1e1b4b";
  const activeAccent = form.cardAccentColor || "#8b5cf6";
  const activeGlow = form.cardAvatarGlowColor || "#38bdf8";
  const activeNameColor1 = form.nameColor1 || "#8b5cf6";
  const activeNameColor2 = form.nameColor2 || "#06b6d4";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span>Hero & Hanging Card Settings</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Customize the landing text, personal name, hanging ID card colors, lanyard strap, and interactive metadata.
          </p>
        </div>

        {(error || uploadError) && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            Unable to save changes to Firebase: {uploadError || error}
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetToDefault();
              setForm(initialPortfolioData.hero);
            }}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={uploadingAvatar}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{uploadingAvatar ? "Uploading Image..." : saved ? "Saved Changes" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Hanging Card Customization Card with Live Preview */}
      <div className="p-6 rounded-3xl border border-primary/20 bg-primary/[0.03] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Hanging ID Card Colors & Name</h3>
              <p className="text-xs text-muted-foreground">
                Edit the lanyard strap, header gradient, accent details, and display name on the badge.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card Name Override */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Hanging Card Display Name</span>
                <span className="text-[10px] lowercase font-normal text-muted-foreground/80">
                  (Syncs with card & hero)
                </span>
              </label>
              <input
                type="text"
                value={form.cardName ?? form.name ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, cardName: val, name: form.name || val });
                }}
                className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Scarlett Rose"
              />
            </div>

            {/* Quick Color Presets */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Quick Color Themes
              </label>
              <div className="flex flex-wrap gap-2">
                {cardColorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-xl border border-foreground/10 hover:border-primary/40 bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className={`w-3 h-3 rounded-full ${preset.dot} shadow-xs`} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Granular Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Lanyard Rope Color */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Lanyard / Strap</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeRope}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeRope}
                    onChange={(e) => setForm({ ...form, cardRopeColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardRopeColor || ""}
                    onChange={(e) => setForm({ ...form, cardRopeColor: e.target.value })}
                    placeholder="#27272a"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Accent & Badge Details */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Badge Accent & Role</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeAccent}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeAccent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cardAccentColor: e.target.value,
                        cardBadgeBgColor: `${e.target.value}20`,
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardAccentColor || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cardAccentColor: e.target.value,
                        cardBadgeBgColor: `${e.target.value}20`,
                      })
                    }
                    placeholder="#8b5cf6"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Header Gradient Start */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Header Gradient Start</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeStart}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeStart}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientStart: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardHeaderGradientStart || ""}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientStart: e.target.value })}
                    placeholder="#6b21a8"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Header Gradient Middle */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Header Gradient Middle</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeVia}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeVia}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientVia: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardHeaderGradientVia || ""}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientVia: e.target.value })}
                    placeholder="#7c3aed"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Header Gradient End */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Header Gradient End</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeEnd}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeEnd}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientEnd: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardHeaderGradientEnd || ""}
                    onChange={(e) => setForm({ ...form, cardHeaderGradientEnd: e.target.value })}
                    placeholder="#1e1b4b"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Avatar Glow Ring */}
              <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Avatar Glow Ring</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{activeGlow}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeGlow}
                    onChange={(e) => setForm({ ...form, cardAvatarGlowColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={form.cardAvatarGlowColor || ""}
                    onChange={(e) => setForm({ ...form, cardAvatarGlowColor: e.target.value })}
                    placeholder="#38bdf8"
                    className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Mini Preview Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border border-foreground/10 relative overflow-hidden">
            {/* Animated Aura Background behind Mini Card Preview */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 ambient-aura-glow pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${activeAccent} 0%, ${activeStart} 50%, ${activeGlow} 100%)`,
              }}
            />

            <div className="text-center mb-3 relative z-10">
              <span className="text-xs font-bold text-foreground">Interactive Card & Aura Mockup</span>
              <p className="text-[11px] text-muted-foreground">Animates & updates instantly with selected colors</p>
            </div>

            {/* Mini hanging lanyard */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-600" />
              <div
                className="w-4 h-10 shadow-sm transition-colors duration-200"
                style={{ backgroundColor: activeRope }}
              />
              <div className="w-6 h-2 rounded bg-zinc-700 -mt-1 shadow-xs" />
            </div>

            {/* Mini Card */}
            <div className="w-64 rounded-2xl overflow-hidden shadow-xl border border-foreground/15 bg-card -mt-1 transition-all duration-200 relative z-10">
              {/* Card Header with gradient */}
              <div
                className="px-4 pt-5 pb-4 flex flex-col items-center text-white relative transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${activeStart}, ${activeVia}, ${activeEnd})`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full p-0.5 shadow-md border border-white/50 overflow-hidden transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${activeGlow}, ${activeAccent}, ${activeStart})`,
                  }}
                >
                  <img
                    src={form.avatarUrl || initialPortfolioData.hero.avatarUrl}
                    alt="Card Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col items-center text-center space-y-2 bg-card text-card-foreground">
                <h4 className="text-sm font-extrabold text-foreground tracking-tight line-clamp-1">
                  {activeCardName}
                </h4>

                <div
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-200 line-clamp-1"
                  style={{
                    backgroundColor: `${activeAccent}18`,
                    borderColor: `${activeAccent}40`,
                    color: activeAccent,
                  }}
                >
                  {form.role || "Director of Product"}
                </div>

                <div className="w-full border-t border-border/60 my-1" />

                <div className="grid grid-cols-2 gap-1.5 w-full text-left text-[10px] bg-muted/40 p-2 rounded-lg border border-border/40">
                  <div>
                    <span className="text-muted-foreground block text-[8px] uppercase tracking-wider font-bold">Specialty</span>
                    <span className="font-semibold text-foreground truncate block">{form.specialty || "Full-Stack AI"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[8px] uppercase tracking-wider font-bold">Experience</span>
                    <span className="font-semibold text-foreground truncate block">{form.experienceYears || "10+ Years"}</span>
                  </div>
                </div>

                {/* Barcode & Badge ID */}
                <div className="flex items-center justify-between w-full px-1 pt-1 text-[9px]">
                  <span className="font-mono font-bold" style={{ color: activeAccent }}>
                    {form.badgeId || "SR-89240-PRO"}
                  </span>
                  <span className="text-muted-foreground text-[8px] uppercase tracking-wider">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Color Animated Name Customization Box */}
      <div className="p-6 rounded-3xl border border-primary/20 bg-primary/[0.03] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Two-Color Animated Name Gradient</h3>
              <p className="text-xs text-muted-foreground">
                Customize the 2 animated colors for "Hi, I'm [Scarlett Rose]" displayed in the Hero banner.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Color 1 & Color 2 Pickers */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color 1 */}
            <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Color 1 (Primary)</span>
                <span className="text-[11px] font-mono text-muted-foreground">{activeNameColor1}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeNameColor1}
                  onChange={(e) => setForm({ ...form, nameColor1: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={form.nameColor1 || ""}
                  onChange={(e) => setForm({ ...form, nameColor1: e.target.value })}
                  placeholder="#8b5cf6"
                  className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Color 2 */}
            <div className="p-3.5 rounded-2xl border border-foreground/10 bg-card space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Color 2 (Accent)</span>
                <span className="text-[11px] font-mono text-muted-foreground">{activeNameColor2}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeNameColor2}
                  onChange={(e) => setForm({ ...form, nameColor2: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-foreground/20 cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={form.nameColor2 || ""}
                  onChange={(e) => setForm({ ...form, nameColor2: e.target.value })}
                  placeholder="#06b6d4"
                  className="flex-1 h-9 px-3 rounded-lg border border-foreground/15 bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Live Animated Name Preview */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-muted/40 border border-foreground/10 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
              Live Animated Headline Preview
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold text-foreground">{form.headline || "Hi, I'm"}</span>
              <span
                className="animated-two-color-name text-3xl font-extrabold tracking-tight select-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${activeNameColor1} 0%, ${activeNameColor2} 50%, ${activeNameColor1} 100%)`,
                }}
              >
                {form.name || "Scarlett Rose"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Colors flow in a continuous infinite animated shimmer effect on the live portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* General Hero Content Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name & Headline */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Greeting Headline</label>
          <input
            type="text"
            value={form.headline || ""}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Hi, I'm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name (Site-wide)</label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Scarlett Rose"
          />
        </div>

        {/* Role & Badge */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Professional Role / Title</label>
          <input
            type="text"
            value={form.role || ""}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Director of Product Engineering"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Badge Security ID</label>
          <input
            type="text"
            value={form.badgeId || ""}
            onChange={(e) => setForm({ ...form, badgeId: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="SR-89240-PRO"
          />
        </div>

        {/* Subheadline across 2 cols */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bio / Subheadline</label>
          <textarea
            rows={3}
            value={form.subheadline || ""}
            onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
            className="w-full p-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* CTA Button & Links */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CTA Button Text</label>
          <input
            type="text"
            value={form.ctaText || ""}
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="View Work"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CTA Target Link</label>
          <input
            type="text"
            value={form.ctaLink || ""}
            onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="#projects"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resume URL</label>
          <input
            type="text"
            value={form.resumeUrl || ""}
            onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2 flex items-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(form.availableForWork)}
              onChange={(e) => setForm({ ...form, availableForWork: e.target.checked })}
              className="w-5 h-5 rounded-md accent-primary"
            />
            <span className="text-sm font-semibold text-foreground">
              Show "Available for work" green pulse indicator
            </span>
          </label>
        </div>

        {/* ID Card metadata */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specialty Tag</label>
          <input
            type="text"
            value={form.specialty || ""}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Full-Stack AI & UX"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location Tag</label>
          <input
            type="text"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Years of Experience</label>
          <input
            type="text"
            value={form.experienceYears || ""}
            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="10+ Years"
          />
        </div>

        {/* Photo Avatar URL or Upload */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ID Card Avatar Photo</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {form.avatarUrl && (
              <div className="relative shrink-0">
                <img
                  src={form.avatarUrl}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-primary/30 shadow-md"
                />
                <button
                  type="button"
                  onClick={handleClearAvatar}
                  disabled={uploadingAvatar}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md disabled:opacity-50"
                  aria-label="Remove avatar image"
                  title="Remove avatar image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={form.avatarUrl || ""}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Image URL (https://...)"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Or upload file:</span>
                <label className="px-3 py-1 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 text-foreground cursor-pointer flex items-center gap-1.5 font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose local file</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
