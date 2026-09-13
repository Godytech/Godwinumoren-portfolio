import React, { useState } from "react";
import { useFirestoreCollection } from "../../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../../data/initialData";
import { ProjectItem } from "../../../types";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  UploadCloud,
  Link as LinkIcon,
} from "lucide-react";

export const ProjectsAdmin: React.FC = () => {
  const { items: projects, addItem, updateItem, deleteItem, reorderItems, resetToDefault } =
    useFirestoreCollection<ProjectItem>("projects", initialPortfolioData.projects);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: "",
      subtitle: "",
      link: "",
      image: "",
      gridClass: "col-span-1 h-[320px]",
      order: projects.length + 1,
    });
    setIsNew(true);
    setShowModal(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject({ ...project });
    setIsNew(false);
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.image.trim()) {
      notify("Please upload a cover image or enter an image URL.");
      return;
    }

    if (isNew) {
      await addItem(editingProject);
      notify("Project successfully created!");
    } else {
      await updateItem(editingProject.id, editingProject);
      notify("Project changes saved!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirmId(null);
    notify("Project deleted.");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    await reorderItems(list);
    notify("Project order updated!");
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (editingProject) {
          setEditingProject({ ...editingProject, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Projects Management</h2>
          <p className="text-sm text-muted-foreground">
            Add, update, reorder, or delete portfolio projects featured on the Bento Grid.
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
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Projects Table / Card List */}
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="glass-panel p-4 sm:p-5 rounded-2xl border border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/30 transition-all group"
          >
            {/* Thumbnail + Details */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-foreground/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-foreground truncate">{project.title}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    Order #{project.order}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{project.subtitle}</p>
                <span className="text-[10px] text-muted-foreground/70 truncate block mt-0.5">
                  {project.link || "No external link set"}
                </span>
              </div>
            </div>

            {/* Actions & Reordering */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2">
              <div className="flex items-center gap-1 mr-2 border border-foreground/10 rounded-lg p-1 bg-foreground/5">
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
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span
                    className="p-2 rounded-xl bg-foreground/5 text-muted-foreground/30"
                    title="No external link set"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(project)}
                  className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 max-w-sm w-full space-y-4 shadow-2xl bg-card">
            <h3 className="text-lg font-bold text-foreground">Confirm Deletion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete this project? This will remove it from the public portfolio.
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-foreground/15 max-w-xl w-full space-y-6 shadow-2xl bg-card my-8">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {isNew ? "Add New Project" : "Edit Project"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. AI-Powered Design Platform"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  placeholder="Brief summary of what this project achieves..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Target Project Link (GitHub or Live Demo)
                  </label>
                  <span className="text-[11px] font-medium text-muted-foreground/70 bg-foreground/5 px-2 py-0.5 rounded-md">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={editingProject.link}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                    placeholder="Optional: https://github.com/... or https://myproject.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Project Cover Image
                  </label>
                  {editingProject.image && (
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, image: "" })}
                      className="text-xs text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                    >
                      Clear image
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Image Preview Box */}
                  {editingProject.image ? (
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-foreground/15 group">
                      <img
                        src={editingProject.image}
                        alt="Project Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-semibold cursor-pointer hover:bg-white/30 transition-colors">
                          Change file
                          <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, image: "" })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Upload Dropzone Placeholder */
                    <label className="h-36 w-full rounded-2xl border-2 border-dashed border-foreground/20 hover:border-primary/50 bg-foreground/[0.02] hover:bg-primary/[0.04] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Click to upload cover image
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        PNG, JPG, WebP, or SVG from your device
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                    </label>
                  )}

                  {/* Or Enter Image URL */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] flex-1 bg-border/60" />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                        Or paste image web address
                      </span>
                      <div className="h-[1px] flex-1 bg-border/60" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="url"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-foreground/15 bg-background text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60"
                        placeholder="https://images.unsplash.com/... or https://example.com/cover.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingProject.order}
                    onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Grid Size Class
                  </label>
                  <select
                    value={editingProject.gridClass || "col-span-1 h-[320px]"}
                    onChange={(e) => setEditingProject({ ...editingProject, gridClass: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-foreground/15 bg-background text-xs text-foreground"
                  >
                    <option value="col-span-1 h-[320px]">Standard (1 Col - Compact 320px)</option>
                    <option value="sm:col-span-2 h-[320px]">Wide (Spans 2 Columns)</option>
                    <option value="sm:col-span-2 lg:col-span-3 h-[360px]">Full Row (Spans 3 Columns)</option>
                  </select>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
