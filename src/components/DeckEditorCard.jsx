import { useState } from "react";

export default function DeckEditorCard({ card, onDelete, onEdit, excludeKeys = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (key) => {
    setEditKey(key);
    setEditValue(card[key] || "");
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (editKey && editValue.trim()) {
      onEdit(card.id, editKey, editValue.trim());
      setIsEditing(false);
      setEditKey(null);
      setEditValue("");
    }
  };

  return (
    <div
      className="flex justify-between items-center bg-dark-100 text-white rounded-lg p-3 shadow-md flex-1 min-w-[200px] max-w-[250px] min-h-[100px]"
      style={{ wordBreak: "break-word" }}
    >
      {/* Content container centered vertically */}
      <div className="flex-1 flex flex-col justify-center">
        {Object.entries(card).map(([key, value]) =>
          key !== "id" && !excludeKeys.includes(key) ? (
            isEditing && editKey === key ? (
              <input
                key={key}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  else if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditKey(null);
                    setEditValue("");
                  }
                }}
                autoFocus
                className="bg-dark-100 text-white rounded p-1 w-full mb-1"
              />
            ) : (
              <p
                key={key}
                className="mb-1 cursor-pointer"
                onClick={() => startEditing(key)}
              >
                <strong>{key}:</strong> {value}
              </p>
            )
          ) : null
        )}
      </div>

      {/* Delete button stays top-right */}
      <div className="flex gap-2">
        <button
          onClick={() => onDelete(card.id)}
          className="text-red-400 hover:text-red-600 transition"
        >
          ❌
        </button>
      </div>
    </div>
  );
}
