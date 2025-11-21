import { Fabric } from "@/types/catalog";

type FabricSwatchProps = {
  fabric: Fabric;
  selected: boolean;
  onSelect: (fabricId: string) => void;
};

export function FabricSwatch({
  fabric,
  selected,
  onSelect,
}: FabricSwatchProps) {
  return (
    <button
      onClick={() => onSelect(fabric.id)}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
        selected
          ? "border-emerald-400 bg-emerald-50 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      <span
        className="h-8 w-8 rounded-2xl border"
        style={{ backgroundColor: fabric.colorHex || "#e5e7eb" }}
      />
      <div>
        <div className="text-xs font-semibold text-gray-900">{fabric.name}</div>
        {fabric.description && (
          <div className="text-[11px] text-gray-500 line-clamp-2">
            {fabric.description}
          </div>
        )}
      </div>
    </button>
  );
}
