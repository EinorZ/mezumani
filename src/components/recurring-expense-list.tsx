"use client";

import { useState, useRef, useEffect } from "react";
import type { RecurringExpense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { SearchableSelect } from "@/components/searchable-select";
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
  items: RecurringExpense[];
  categories: string[];
  categoryColorMap: Record<string, string>;
  cards: string[];
  cardColorMap: Record<string, string>;
  onAdd: (
    name: string,
    amount: number,
    category: string,
    card: string,
    keywords: string,
    tentative: boolean,
  ) => Promise<void>;
  onUpdate: (
    oldName: string,
    name: string,
    amount: number,
    category: string,
    card: string,
    keywords: string,
    tentative: boolean,
  ) => Promise<void>;
  onRemove: (name: string) => Promise<void>;
  onReorder: (items: RecurringExpense[]) => Promise<void>;
}

function SortableExpenseRow({
  id,
  item,
  categories,
  categoryColorMap,
  cards,
  cardColorMap,
  onUpdate,
  onRemove,
  submitting,
  setSubmitting,
}: {
  id: string;
  item: RecurringExpense;
  categories: string[];
  categoryColorMap: Record<string, string>;
  cards: string[];
  cardColorMap: Record<string, string>;
  onUpdate: Props["onUpdate"];
  onRemove: Props["onRemove"];
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editAmount, setEditAmount] = useState(
    item.amount ? String(item.amount) : "",
  );
  const [editCategory, setEditCategory] = useState(item.category);
  const [editCard, setEditCard] = useState(item.card);
  const [editKeywords, setEditKeywords] = useState(item.keywords);
  const [editTentative, setEditTentative] = useState(item.tentative ?? false);
  const editRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: editing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (!editing) return;
    function handleClickOutside(e: MouseEvent) {
      if (editRef.current && !editRef.current.contains(e.target as Node)) {
        setEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing]);

  function startEdit() {
    setEditName(item.name);
    setEditAmount(item.amount ? String(item.amount) : "");
    setEditCategory(item.category);
    setEditCard(item.card);
    setEditKeywords(item.keywords);
    setEditTentative(item.tentative ?? false);
    setEditing(true);
  }

  async function handleSave() {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const newAmount = parseFloat(editAmount) || 0;
    if (
      trimmed === item.name &&
      newAmount === item.amount &&
      editCategory === item.category &&
      editCard === item.card &&
      editKeywords === item.keywords &&
      editTentative === (item.tentative ?? false)
    ) {
      setEditing(false);
      return;
    }
    setSubmitting(true);
    try {
      await onUpdate(
        item.name,
        trimmed,
        newAmount,
        editCategory,
        editCard,
        editKeywords,
        editTentative,
      );
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    try {
      await onRemove(item.name);
    } finally {
      setSubmitting(false);
    }
  }

  if (editing) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") setEditing(false);
    };

    return (
      <div
        ref={editRef}
        className="d-flex gap-2 align-items-end flex-wrap p-2 border rounded-2 bg-light"
      >
        <div style={{ minWidth: "120px" }}>
          <input
            className="form-control form-control-sm"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div style={{ minWidth: "90px", display: "flex", alignItems: "center" }}>
          <button
            type="button"
            className={`tentative-prefix${editTentative ? " active" : ""}`}
            onClick={() => setEditTentative(!editTentative)}
            title="משוער"
          >
            ~
          </button>
          <input
            className="form-control form-control-sm"
            type="number"
            placeholder="0"
            style={editTentative ? { color: "#c2770e", fontStyle: "italic" } : undefined}
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div style={{ minWidth: "120px" }}>
          <SearchableSelect
            options={categories}
            colorMap={categoryColorMap}
            value={editCategory}
            onChange={setEditCategory}
            placeholder="קטגוריה..."
          />
        </div>
        <div style={{ minWidth: "120px" }}>
          <SearchableSelect
            options={cards}
            colorMap={cardColorMap}
            value={editCard}
            onChange={setEditCard}
            placeholder="כרטיס..."
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <input
            className="form-control form-control-sm"
            placeholder="מילות חיפוש (מופרד ב-|)"
            value={editKeywords}
            onChange={(e) => setEditKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setEditing(false)}
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
      style={{ ...style, cursor: "pointer" }}
      className="d-flex align-items-center gap-2 p-2 border rounded-2"
      onClick={startEdit}
    >
      <span
        {...attributes}
        {...listeners}
        className="text-secondary"
        style={{ cursor: "grab", fontSize: "1rem", touchAction: "none" }}
        title="גרור לשינוי סדר"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </span>
      <span className="fw-bold small">{item.name}</span>
      {item.amount > 0 && (
        <span
          className="badge rounded-pill"
          style={
            item.tentative
              ? { backgroundColor: "#c2770e", fontStyle: "italic" }
              : { backgroundColor: "#6c757d" }
          }
        >
          {item.tentative ? "~" : ""}{formatCurrency(item.amount)}
        </span>
      )}
      {item.category && (
        <span
          className="badge rounded-pill"
          style={{
            backgroundColor: categoryColorMap[item.category] || "#6c757d",
          }}
        >
          {item.category}
        </span>
      )}
      {item.card && (
        <span
          className="badge rounded-pill"
          style={{
            backgroundColor: cardColorMap[item.card] || "#6c757d",
          }}
        >
          {item.card}
        </span>
      )}
      {item.keywords && (
        <span className="badge rounded-pill bg-info" title={item.keywords}>
          🔍
        </span>
      )}
      <button
        className="btn btn-sm p-0 border-0 text-danger opacity-75 ms-auto"
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        disabled={submitting}
        style={{ fontSize: "0.85rem", lineHeight: 1 }}
      >
        &times;
      </button>
    </div>
  );
}

export function RecurringExpenseList({
  items,
  categories,
  categoryColorMap,
  cards,
  cardColorMap,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [card, setCard] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tentative, setTentative] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = items.map((item, idx) => `${item.name}-${idx}`);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setSubmitting(true);
    try {
      await onReorder(reordered);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdd() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setSubmitting(true);
    try {
      await onAdd(
        trimmedName,
        parseFloat(amount) || 0,
        category,
        card,
        keywords,
        tentative,
      );
      setName("");
      setAmount("");
      setCategory("");
      setCard("");
      setKeywords("");
      setTentative(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <DndContext
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
                <SortableExpenseRow
                  key={`${item.name}-${idx}`}
                  id={`${item.name}-${idx}`}
                  item={item}
                  categories={categories}
                  categoryColorMap={categoryColorMap}
                  cards={cards}
                  cardColorMap={cardColorMap}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  submitting={submitting}
                  setSubmitting={setSubmitting}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="d-flex gap-2 align-items-end flex-wrap">
        <div style={{ minWidth: "120px" }}>
          <label className="form-label small mb-1">שם *</label>
          <input
            className="form-control form-control-sm"
            placeholder="שם הוצאה..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <div style={{ minWidth: "90px" }}>
          <label className="form-label small mb-1">סכום</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className={`tentative-prefix${tentative ? " active" : ""}`}
              onClick={() => setTentative(!tentative)}
              title="משוער"
            >
              ~
            </button>
            <input
              className="form-control form-control-sm"
              type="number"
              placeholder="0"
              style={tentative ? { color: "#c2770e", fontStyle: "italic" } : undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
        </div>
        <div style={{ minWidth: "120px" }}>
          <label className="form-label small mb-1">קטגוריה</label>
          <SearchableSelect
            options={categories}
            colorMap={categoryColorMap}
            value={category}
            onChange={setCategory}
            placeholder="בחר..."
          />
        </div>
        <div style={{ minWidth: "120px" }}>
          <label className="form-label small mb-1">כרטיס</label>
          <SearchableSelect
            options={cards}
            colorMap={cardColorMap}
            value={card}
            onChange={setCard}
            placeholder="בחר..."
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <label className="form-label small mb-1">מילות חיפוש</label>
          <input
            className="form-control form-control-sm"
            placeholder="מופרד ב-|"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <button
          className="btn btn-sm btn-success"
          onClick={handleAdd}
          disabled={submitting || !name.trim()}
        >
          {submitting ? "..." : "הוסף"}
        </button>
      </div>
    </div>
  );
}
