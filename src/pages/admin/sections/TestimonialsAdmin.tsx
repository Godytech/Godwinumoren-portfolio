import React, { useState } from "react";
import { useFirestoreCollection } from "../../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../../data/initialData";
import { TestimonialItem } from "../../../types";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Check, X, RotateCcw } from "lucide-react";

export const TestimonialsAdmin: React.FC = () => {
  const { items: testimonials, addItem, updateItem, deleteItem, reorderItems, resetToDefault } =
    useFirestoreCollection<TestimonialItem>("testimonials", initialPortfolioData.testimonials);

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingItem({
      id: `tst-${Date.now()}`,
      name: "",
      role: "CTO, Company",
      content: "",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      order: testimonials.length + 1,
    });
    setIsNew(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingItem({ ...item });
    setIsNew(false);
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isNew) {
      await addItem(editingItem);
      notify("Testimonial added!");
    } else {
      await updateItem(editingItem.id, editingItem);
      notify("Testimonial updated!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirmId(null);
    notify("Testimonial removed.");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const list = [...testimonials];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    await reorderItems(list);
    notify("Testimonial order updated!");
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (editingItem) {
          setEditingItem({ ...editingItem, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Testimonials Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage executive reviews, recommendations, client quotes, and avatars.
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
            <span>Add Testimonial</span>
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
        {testimonials.map((test, idx) => (
          <div
            key={test.id}
            className="glass-panel p-5 rounded-2xl border border-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={test.image}
                alt={test.name}
                className="w-14 h-14 rounded-full object-cover border border-foreground/15 shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-foreground">{test.name}</h4>
                  <span className="text-xs text-primary font-semibold">{test.role}</span>
                </div>
                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  "{test.content}"
                </p>
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
                  disabled={idx === testimonials.length - 1}
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
                  onClick={() => handleOpenEdit(test)}
                  className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(test.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                  title="Delete Testimonial"
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
              Are you sure you want to remove this client testimonial?
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
                {isNew ? "Add Testimonial" : "Edit Testimonial"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Elena Rostova"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Client Role & Company
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="CTO, Lumina AI"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Testimonial Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
                  placeholder="Scarlett transformed our core architecture..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Avatar Photo
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {editingItem.image && (
                      <img
                        src={editingItem.image}
                        alt="Avatar preview"
                        className="w-12 h-12 rounded-full object-cover border border-foreground/15"
                      />
                    )}
                    <input
                      type="text"
                      required
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Image URL"
                    />
                  </div>
                  <label className="px-3.5 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 text-foreground cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload local image</span>
                    <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                  </label>
                </div>
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
