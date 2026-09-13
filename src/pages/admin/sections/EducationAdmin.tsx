import React, { useState } from "react";
import { useFirestoreCollection } from "../../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../../data/initialData";
import { EducationItem } from "../../../types";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, X, RotateCcw } from "lucide-react";

export const EducationAdmin: React.FC = () => {
  const { items: education, addItem, updateItem, deleteItem, reorderItems, resetToDefault } =
    useFirestoreCollection<EducationItem>("education", initialPortfolioData.education);

  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [detailsText, setDetailsText] = useState("");

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem({
      id: `edu-${Date.now()}`,
      degree: "",
      school: "",
      year: "2018 – 2022",
      badge: "Honors",
      details: ["Specialized in Distributed Architecture"],
      order: education.length + 1,
    });
    setDetailsText("Specialized in Distributed Architecture");
    setIsNew(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem({ ...item });
    setDetailsText((item.details || []).join("\n"));
    setIsNew(false);
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const parsedDetails = detailsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...editingItem,
      details: parsedDetails,
    };

    if (isNew) {
      await addItem(payload);
      notify("Degree added successfully!");
    } else {
      await updateItem(payload.id, payload);
      notify("Degree updated!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirmId(null);
    notify("Degree removed.");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const list = [...education];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    await reorderItems(list);
    notify("Education order updated!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Academic Background</h2>
          <p className="text-sm text-muted-foreground">
            Manage university degrees, honors badges, and research highlights.
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
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Degree</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div
            key={edu.id}
            className="glass-panel p-5 rounded-2xl border border-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/30 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-foreground">{edu.degree}</h4>
                <span className="text-xs text-primary font-semibold">({edu.year})</span>
                {edu.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {edu.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">{edu.school}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {edu.details?.map((det, dIdx) => (
                  <span key={dIdx} className="text-[11px] bg-foreground/5 px-2.5 py-1 rounded-lg text-foreground/80">
                    • {det}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
              <div className="flex items-center gap-1 border border-foreground/10 rounded-lg p-1 bg-foreground/5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === education.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(edu)}
                  className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  title="Edit Degree"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(edu.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                  title="Delete Degree"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl bg-card">
            <h3 className="text-lg font-bold text-foreground">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to remove this education record?
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
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-foreground/15 max-w-lg w-full space-y-5 shadow-2xl bg-card">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {isNew ? "Add Degree Record" : "Edit Degree"}
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
                  Degree Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.degree}
                  onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. M.Sc. in Computer Science"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Institution / School
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.school}
                  onChange={(e) => setEditingItem({ ...editingItem, school: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. University of California, Berkeley"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Year Range
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                    placeholder="2016 – 2018"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Distinction Badge
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                    placeholder="Top 5% Honors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Highlights / Focus Details (One per line)
                </label>
                <textarea
                  rows={4}
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-foreground/15 bg-background text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                  placeholder="Specialized in Distributed Systems&#10;Published 2 IEEE research papers"
                />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
