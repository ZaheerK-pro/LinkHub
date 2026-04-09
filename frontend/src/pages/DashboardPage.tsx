import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AnalyticsChart } from "../components/AnalyticsChart";
import { Skeleton } from "../components/Skeleton";
import { SortableLinkCard } from "../components/SortableLinkCard";
import { ThemePicker, themePresets } from "../components/ThemePicker";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuth } from "../state/auth";
import { LinkItem, ThemeConfig } from "../types";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [themeDraft, setThemeDraft] = useState<ThemeConfig>({});
  const [selectedAnalyticsLinkId, setSelectedAnalyticsLinkId] = useState("all");
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [editTarget, setEditTarget] = useState<LinkItem | null>(null);
  const [editForm, setEditForm] = useState({ title: "", url: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const {
    linksQuery,
    themeQuery,
    analyticsQuery,
    createLinkMutation,
    updateLinkMutation,
    deleteLinkMutation,
    reorderLinksMutation,
    updateThemeMutation
  } = useDashboardData(selectedAnalyticsLinkId);
  const links = linksQuery.data || [];
  const analytics = analyticsQuery.data || null;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (linksQuery.isError || themeQuery.isError || analyticsQuery.isError) {
      toast.error("Failed to load dashboard");
    }
  }, [linksQuery.isError, themeQuery.isError, analyticsQuery.isError]);

  useEffect(() => {
    if (!themeQuery.data) return;
    setThemeDraft(themeQuery.data);
    Object.entries(themeQuery.data).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
  }, [themeQuery.data]);

  async function createLink(e: FormEvent) {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return toast.error("Enter title and URL");
    await createLinkMutation.mutateAsync(newLink);
    setNewLink({ title: "", url: "" });
    toast.success("Link added");
  }

  async function deleteLink(id: string) {
    await deleteLinkMutation.mutateAsync(id);
    toast.success("Link removed");
  }

  function openEditModal(link: LinkItem) {
    setEditTarget(link);
    setEditForm({ title: link.title, url: link.url });
  }

  async function saveEditLink() {
    if (!editTarget) return;
    if (!editForm.title || !editForm.url) {
      toast.error("Title and URL are required");
      return;
    }
    setSavingEdit(true);
    try {
      await updateLinkMutation.mutateAsync({ id: editTarget.id, payload: { title: editForm.title, url: editForm.url } });
      toast.success("Link updated");
      setEditTarget(null);
    } finally {
      setSavingEdit(false);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    if (savingOrder) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const updated = arrayMove(links, oldIndex, newIndex);
    setSavingOrder(true);
    try {
      await reorderLinksMutation.mutateAsync(updated.map((l) => l.id));
      toast.success("Order saved");
    } catch {
      toast.error("Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  }

  async function saveTheme(nextTheme: ThemeConfig) {
    await updateThemeMutation.mutateAsync(nextTheme);
    setThemeDraft(nextTheme);
    toast.success("Theme updated");
  }

  function updateThemeField(key: string, value: string) {
    setThemeDraft((prev) => ({ ...prev, [key]: value }));
  }

  const chartData = useMemo(
    () => (analytics?.chart || []).map((item) => ({ day: item.day, clicks: Number(item.clicks) })),
    [analytics]
  );
  const selectedAnalyticsLink = useMemo(
    () => links.find((link) => link.id === selectedAnalyticsLinkId) || null,
    [links, selectedAnalyticsLinkId]
  );

  if (linksQuery.isLoading || themeQuery.isLoading || analyticsQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Skeleton className="mb-3 h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="w-full space-y-6 px-3 py-4 sm:space-y-8 sm:px-4 sm:py-6 md:px-8">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-4 text-white shadow-2xl sm:rounded-[32px] sm:p-6">
          <div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Creator Console</p>
              <h1 className="mt-1 break-words text-2xl font-black sm:text-3xl md:text-4xl">Hey @{user?.username}</h1>
              <p className="mt-1 text-sm text-blue-100">Manage links, theme, and growth from one place.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <button
                className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 sm:w-auto"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.username}`);
                  toast.success("Profile link copied");
                }}
              >
                Copy Profile Link
              </button>
              <button
                className="w-full rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 sm:w-auto"
                onClick={() => setConfirmLogoutOpen(true)}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-2 sm:mt-6">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Links: {links.length}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
              Clicks{selectedAnalyticsLinkId === "all" ? "" : " (selected)"}: {analytics?.totalClicks ?? 0}
            </span>
            <Link to={`/profile/${user?.username}`} className="rounded-full bg-white/15 px-3 py-1 text-xs hover:bg-white/25">
              /profile/{user?.username}
            </Link>
          </div>
        </header>

        <section className="border-b border-slate-200 pb-6 sm:pb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Quick Add Link</h2>
              <p className="text-sm text-slate-500">Add links fast, then reorder and optimize.</p>
            </div>
            <div className="hidden rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 md:block">
              Fast publish
            </div>
          </div>
          <form className="grid gap-3 md:grid-cols-12" onSubmit={createLink}>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 md:col-span-4"
              placeholder="Title"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 md:col-span-6"
              placeholder="https://..."
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white md:col-span-2">
              Add
            </button>
          </form>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <main className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your Link Stack</h2>
                <p className="text-sm text-slate-500">Drag to reorder your links.</p>
              </div>
              {links.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">No links yet. Add one above.</div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    {links.map((link) => (
                      <SortableLinkCard key={link.id} link={link} onDelete={setDeleteTarget} onEdit={openEditModal} />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Insights</h3>
                  <p className="text-sm text-slate-500">
                    {selectedAnalyticsLink
                      ? `Showing analytics for: ${selectedAnalyticsLink.title}`
                      : "Showing analytics for all links"}
                  </p>
                </div>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm sm:w-auto"
                  value={selectedAnalyticsLinkId}
                  onChange={(e) => {
                    setSelectedAnalyticsLinkId(e.target.value);
                  }}
                >
                  <option value="all">All links</option>
                  {links.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.title}
                    </option>
                  ))}
                </select>
              </div>
              <AnalyticsChart data={chartData} />
            </section>
          </main>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
            <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
              <h3 className="text-xl font-bold text-slate-900">Theme</h3>
              <div className="mt-3">
                <ThemePicker onPick={saveTheme} />
              </div>
              <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Custom Theme</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <label className="text-xs text-slate-600">
                    Background
                    <input
                      type="color"
                      className="mt-1 h-9 w-full rounded border border-slate-200"
                      value={themeDraft["--bg"] || themePresets.light["--bg"]}
                      onChange={(e) => updateThemeField("--bg", e.target.value)}
                    />
                  </label>
                  <label className="text-xs text-slate-600">
                    Text
                    <input
                      type="color"
                      className="mt-1 h-9 w-full rounded border border-slate-200"
                      value={themeDraft["--text"] || themePresets.light["--text"]}
                      onChange={(e) => updateThemeField("--text", e.target.value)}
                    />
                  </label>
                  <label className="text-xs text-slate-600">
                    Button
                    <input
                      type="color"
                      className="mt-1 h-9 w-full rounded border border-slate-200"
                      value={themeDraft["--button"] || themePresets.light["--button"]}
                      onChange={(e) => updateThemeField("--button", e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-600">
                    Font
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm"
                      value={themeDraft["--font"] || themePresets.light["--font"]}
                      onChange={(e) => updateThemeField("--font", e.target.value)}
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Montserrat, sans-serif">Montserrat</option>
                    </select>
                  </label>
                  <label className="text-xs text-slate-600">
                    Radius
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm"
                      value={themeDraft["--radius"] || "12px"}
                      onChange={(e) => updateThemeField("--radius", e.target.value)}
                    >
                      <option value="10px">Soft</option>
                      <option value="14px">Rounded</option>
                      <option value="20px">Pill</option>
                    </select>
                  </label>
                </div>
                <button
                  className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  onClick={() =>
                    saveTheme({
                      ...themeDraft,
                      "--card": themeDraft["--card"] || "#ffffff",
                      "--buttonText": themeDraft["--buttonText"] || "#ffffff"
                    })
                  }
                >
                  Save Custom Theme
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-5">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedAnalyticsLinkId === "all" ? "Top Links" : "Selected Link Summary"}
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {(analytics?.topLinks || []).length === 0 ? (
                  <li className="text-slate-500">No click data yet.</li>
                ) : (
                  (analytics?.topLinks || []).map((item, index) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-slate-600">{selectedAnalyticsLinkId === "all" ? `#${index + 1}` : "Clicks"}</span>
                      <span className="font-semibold text-slate-900">{item.clicks}</span>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Delete link?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold">{deleteTarget.title}</span>? This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={async () => {
                  const id = deleteTarget.id;
                  setDeleteTarget(null);
                  await deleteLink(id);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Edit link</h3>
            <p className="mt-1 text-sm text-slate-500">Update title and URL.</p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                value={editForm.url}
                onChange={(e) => setEditForm((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm" onClick={() => setEditTarget(null)}>
                Cancel
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={saveEditLink}
                disabled={savingEdit}
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Logout?</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to logout from your account?</p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm" onClick={() => setConfirmLogoutOpen(false)}>
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={() => {
                  setConfirmLogoutOpen(false);
                  logout();
                }}
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
