import { useEffect, useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
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
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { PageLoader } from "../components/PageLoader";
import { useProfileData } from "../hooks/useProfileData";
import { iconForUrl } from "../lib/icons";
import { useAuth } from "../state/auth";
import { LinkItem, ThemeConfig } from "../types";

function SortableProfileLink({ link, onClick }: { link: LinkItem; onClick: (linkId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none" as const
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        onClick={() => onClick(link.id)}
        className={`group relative flex items-center justify-between gap-3 overflow-hidden rounded-3xl p-4 font-semibold shadow-xl transition hover:-translate-y-1 sm:p-5 ${
          isDragging ? "scale-[1.01] shadow-2xl ring-2 ring-blue-200" : ""
        }`}
        style={{ background: "var(--card)", color: "var(--text)" }}
      >
        <span className="pointer-events-none absolute right-0 top-0 h-full w-2 bg-[var(--button)] opacity-70" />
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "color-mix(in srgb, var(--button) 18%, transparent)" }}
          >
            {iconForUrl(link.url)}
          </span>
          <span className="max-w-[180px] truncate sm:max-w-[220px]">{link.title}</span>
        </span>
        <span className="rounded-lg px-2 py-1 text-sm transition group-hover:translate-x-0.5" style={{ background: "var(--button)", color: "var(--buttonText)" }}>
          ↗
        </span>
      </a>
    </div>
  );
}

export function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const { profileQuery, clickMutation, reorderLinksMutation } = useProfileData(username);
  const profile = profileQuery.data || null;
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!profile) return;
    setLinks(profile.links || []);
    Object.entries(profile.tenant.theme as ThemeConfig).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, String(v))
    );
  }, [profile]);

  useEffect(() => {
    if (profileQuery.isError) toast.error("Profile not found");
  }, [profileQuery.isError]);

  async function clickLink(linkId: string) {
    await clickMutation.mutateAsync(linkId);
  }

  const canReorder = useMemo(
    () => Boolean(user?.username && profile?.username && user.username === profile.username),
    [user?.username, profile?.username]
  );

  const orderedLinks = useMemo(
    () => [...links].sort((a, b) => a.order_index - b.order_index),
    [links]
  );

  async function onDragEnd(event: DragEndEvent) {
    if (!canReorder || savingOrder) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedLinks.findIndex((l) => l.id === active.id);
    const newIndex = orderedLinks.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const updated = arrayMove(orderedLinks, oldIndex, newIndex).map((link, index) => ({
      ...link,
      order_index: index
    }));
    setLinks(updated);
    setSavingOrder(true);
    try {
      await reorderLinksMutation.mutateAsync(updated.map((l) => l.id));
      toast.success("Profile order saved");
    } catch {
      setLinks(orderedLinks);
      toast.error("Failed to save profile order");
    } finally {
      setSavingOrder(false);
    }
  }

  if (profileQuery.isLoading) return <PageLoader label="Loading profile..." />;
  if (!profile) return <PageLoader label="Profile unavailable." />;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 15% 12%, color-mix(in srgb, var(--button) 20%, transparent), transparent 35%), radial-gradient(circle at 85% 85%, color-mix(in srgb, var(--button) 16%, transparent), transparent 34%), var(--bg)",
        color: "var(--text)"
      }}
    >
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="mb-4 sm:mb-5">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full bg-black/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/30 sm:px-4 sm:text-sm"
          >
            ← Back
          </Link>
        </div>
        <header
          className="relative mb-5 overflow-hidden rounded-3xl p-5 text-center shadow-2xl sm:mb-8 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--button) 88%, #0f172a 12%), color-mix(in srgb, var(--button) 62%, #111827 38%))",
            color: "var(--buttonText)"
          }}
        >
          <div className="pointer-events-none absolute -left-12 top-2 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-xs uppercase tracking-[0.25em] opacity-80">LinkHub Public</p>
          <h1 className="relative mt-2 break-words text-2xl font-black sm:text-4xl md:text-5xl">@{profile.username}</h1>
          <p className="relative mt-2 text-xs opacity-85 sm:text-sm">{profile.tenant?.name || "LinkHub"}</p>
          <p className="relative mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs">
            {orderedLinks.length} published links
          </p>
        </header>

        <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {orderedLinks.length === 0 ? (
            <div className="col-span-full rounded-3xl p-8 text-center shadow-xl sm:p-10" style={{ background: "var(--card)" }}>
              No links published yet.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderedLinks.map((l) => l.id)} strategy={rectSortingStrategy}>
                {orderedLinks.map((link) => (
                  <SortableProfileLink key={link.id} link={link} onClick={clickLink} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </section>
        {canReorder && <p className="mt-3 text-sm text-slate-500">Drag and drop links to reorder your public profile.</p>}
      </div>
    </div>
  );
}
