"use client";

import { useState } from "react";
import type { SummaryCard } from "@/lib/types";
import { MultiSearchableSelect } from "@/components/multi-searchable-select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  items: SummaryCard[];
  availableCategories: string[];
  onAdd: (label: string, categories: string) => Promise<void>;
  onRemove: (label: string) => Promise<void>;
  onUpdate: (
    oldLabel: string,
    newLabel: string,
    categories: string,
  ) => Promise<void>;
  onReorder?: (items: SummaryCard[]) => Promise<void>;
}

function SortableSummaryCard({
  id,
  item,
  idx,
  availableCategories,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
  editingIdx,
  setEditingIdx,
}: {
  id: string;
  item: SummaryCard;
  idx: number;
  availableCategories: string[];
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  editingIdx: number | null;
  setEditingIdx: (v: number | null) => void;
}) {
  const [editLabel, setEditLabel] = useState("");
  const [editSelected, setEditSelected] = useState<Set<string>>(new Set());
  const isEditing = editingIdx === idx;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function startEdit() {
    setEditingIdx(idx);
    setEditLabel(item.label);
    setEditSelected(new Set(item.categories));
  }

  async function handleSaveEdit() {
    const trimmed = editLabel.trim();
    if (!trimmed || editSelected.size === 0) return;
    setSubmitting(true);
    try {
      await onUpdate(item.label, trimmed, [...editSelected].join(","));
      setEditingIdx(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    try {
      await onRemove(item.label);
    } finally {
      setSubmitting(false);
    }
  }

  if (isEditing) {
    return (
      <div className="d-flex gap-2 align-items-start border rounded p-2 bg-light">
        <input
          className="form-control form-control-sm"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          style={{ maxWidth: "8rem" }}
          autoFocus
        />
        <MultiSearchableSelect
          options={availableCategories}
          colorMap={{}}
          selected={editSelected}
          onChange={setEditSelected}
          placeholder="בחר קטגוריות..."
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleSaveEdit}
          disabled={submitting || !editLabel.trim() || editSelected.size === 0}
        >
          {submitting ? "..." : "שמור"}
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setEditingIdx(null)}
          disabled={submitting}
        >
          ביטול
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="d-inline-flex align-items-center"
    >
      <span
        className="badge d-inline-flex align-items-center gap-1 px-2 py-2 bg-secondary"
        style={{ cursor: "pointer" }}
        onClick={startEdit}
        title="לחץ לעריכה"
      >
        <span
          {...attributes}
          {...listeners}
          className="text-white opacity-75"
          style={{ cursor: "grab", fontSize: "0.8rem", touchAction: "none" }}
          onClick={(e) => e.stopPropagation()}
          title="גרור לשינוי סדר"
        >
          ⠿
        </span>
        <span>
          {item.label}
          <span className="opacity-75 ms-1" style={{ fontSize: "0.7em" }}>
            ({item.categories.join(", ")})
          </span>
        </span>
        <button
          className="btn btn-sm p-0 border-0 text-white opacity-75"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          disabled={submitting}
          style={{ fontSize: "0.75rem", lineHeight: 1 }}
        >
          &times;
        </button>
      </span>
    </div>
  );
}

export function SummaryCardList({
  items,
  availableCategories,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
}: Props) {
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = items.map((item, idx) => `${item.label}-${idx}`);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    if (onReorder) {
      setSubmitting(true);
      try {
        await onReorder(reordered);
      } finally {
        setSubmitting(false);
      }
    }
  }

  async function handleAdd() {
    const trimmedLabel = label.trim();
    if (!trimmedLabel || selected.size === 0) return;
    setSubmitting(true);
    try {
      await onAdd(trimmedLabel, [...selected].join(","));
      setLabel("");
      setSelected(new Set());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <DndContext
          id="summary-cards-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="d-flex flex-column gap-2 mb-3">
              {items.map((item, idx) => (
                <SortableSummaryCard
                  key={`${item.label}-${idx}`}
                  id={`${item.label}-${idx}`}
                  item={item}
                  idx={idx}
                  availableCategories={availableCategories}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  submitting={submitting}
                  setSubmitting={setSubmitting}
                  editingIdx={editingIdx}
                  setEditingIdx={setEditingIdx}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <div className="d-flex gap-2 align-items-start">
        <input
          className="form-control form-control-sm"
          placeholder="שם כרטיס..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ maxWidth: "8rem" }}
        />
        <MultiSearchableSelect
          options={availableCategories}
          colorMap={{}}
          selected={selected}
          onChange={setSelected}
          placeholder="בחר קטגוריות..."
        />
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !label.trim() || selected.size === 0}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
