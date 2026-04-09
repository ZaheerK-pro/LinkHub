import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { iconForUrl } from "../lib/icons";
import { LinkItem } from "../types";

type Props = {
  link: LinkItem;
  onDelete: (link: LinkItem) => void;
  onEdit: (link: LinkItem) => void;
};

export function SortableLinkCard({ link, onDelete, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none" as const
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-3 flex flex-col items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-4 ${
        isDragging ? "scale-[1.01] border-blue-300 shadow-lg ring-2 ring-blue-200" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab self-start rounded-lg border border-slate-200 px-2 py-1 text-slate-500 active:cursor-grabbing sm:mr-3"
        aria-hidden="true"
        tabIndex={-1}
      >
        :::
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">
          {iconForUrl(link.url)} {link.title}
        </p>
        <a href={link.url} target="_blank" className="block truncate text-sm text-slate-500 hover:text-blue-600" rel="noreferrer">
          {link.url}
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 sm:py-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(link)}
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 sm:py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
