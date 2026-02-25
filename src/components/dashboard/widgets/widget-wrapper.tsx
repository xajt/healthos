"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Widget } from "./types";

interface WidgetWrapperProps {
  widget: Widget;
  children: React.ReactNode;
  isEditing?: boolean;
  onRemove?: (id: string) => void;
}

export function WidgetWrapper({ widget, children, isEditing, onRemove }: WidgetWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border border-zinc-200 overflow-hidden ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          )}
          <h3 className="text-sm font-semibold text-zinc-900">{widget.title}</h3>
        </div>

        {isEditing && (
          <button
            onClick={() => onRemove?.(widget.id)}
            className="text-zinc-400 hover:text-red-500 transition-colors"
            aria-label="Usuń widget"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Widget Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
