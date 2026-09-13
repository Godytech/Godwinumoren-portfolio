import React, { useState } from "react";
import { useFirestoreCollection } from "../../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../../data/initialData";
import { SkillItem } from "../../../types";
import { Plus, Edit2, Trash2, Check, X, RotateCcw } from "lucide-react";

export const SkillsAdmin: React.FC = () => {
  const { items: skills, addItem, updateItem, deleteItem, resetToDefault } =
    useFirestoreCollection<SkillItem>("skills", initialPortfolioData.skills);

  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenCreate = (category: "technical" | "soft") => {
    setEditingItem({
      id: `skl-${Date.now()}`,
      name: "",
      category,
      level: category === "technical" ? 85 : undefined,
      icon: category === "technical" ? "Code2" : "Brain",
      order: skills.length + 1,
    });
    setIsNew(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: SkillItem) => {
    setEditingItem({ ...item });
    setIsNew(false);
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isNew) {
      await addItem(editingItem);
      notify("Skill added successfully!");
    } else {
      await updateItem(editingItem.id, editingItem);
      notify("Skill updated!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirmId(null);
    notify("Skill deleted.");
  };

  const technicalSkills = skills.filter((s) => s.category === "technical");
  const softSkills = skills.filter((s) => s.category === "soft");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Skills & Capabilities</h2>
          <p className="text-sm text-muted-foreground">
            Manage technical proficiency percentages and leadership / soft skill badges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetToDefault}
            className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Two-Column split for Tech vs Soft */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Arsenal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-lg font-bold text-foreground">Technical Arsenal</h3>
            <button
              type="button"
              onClick={() => handleOpenCreate("technical")}
              className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tech</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {technicalSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl border border-foreground/10 bg-card/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    {skill.level}%
                  </span>
                  <span className="text-sm font-bold text-foreground truncate">{skill.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(skill.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills & Competencies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="text-lg font-bold text-foreground">Professional Traits & Soft Skills</h3>
            <button
              type="button"
              onClick={() => handleOpenCreate("soft")}
              className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trait</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {softSkills.map((skill) => (
              <div
                key={skill.id}
                className="px-3.5 py-2 rounded-xl border border-primary/20 bg-primary/10 text-primary text-xs font-bold flex items-center gap-2"
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(skill)}
                  className="hover:text-foreground cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(skill.id)}
                  className="hover:text-red-500 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl bg-card">
            <h3 className="text-lg font-bold text-foreground">Delete Skill</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to remove this skill item?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-foreground/15 max-w-md w-full space-y-5 shadow-2xl bg-card">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {isNew ? "Add Skill" : "Edit Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Skill / Trait Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. Distributed Systems or Executive Leadership"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as "technical" | "soft",
                        level: e.target.value === "technical" ? editingItem.level || 85 : undefined,
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                  >
                    <option value="technical">Technical Arsenal</option>
                    <option value="soft">Soft Trait</option>
                  </select>
                </div>

                {editingItem.category === "technical" && (
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Proficiency Level ({editingItem.level || 0}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={editingItem.level || 85}
                      onChange={(e) => setEditingItem({ ...editingItem, level: Number(e.target.value) })}
                      className="w-full accent-primary mt-2"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Icon Name (Lucide)
                </label>
                <select
                  value={editingItem.icon || "Code2"}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                >
                  <option value="Code2">Code2</option>
                  <option value="Server">Server</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Atom">Atom</option>
                  <option value="Brain">Brain</option>
                  <option value="Crown">Crown</option>
                  <option value="Workflow">Workflow</option>
                  <option value="HeartHandshake">HeartHandshake</option>
                  <option value="Lightbulb">Lightbulb</option>
                  <option value="Users">Users</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
