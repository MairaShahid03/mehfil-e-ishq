import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical, RotateCcw, Download, Save, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface CanvasItem {
  id: string;
  type: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const BUILDER_ITEMS = [
  { type: "stage", label: "Stage", icon: "🎭", width: 180, height: 80, color: "rgba(212, 168, 67, 0.3)" },
  { type: "seating", label: "Seating Area", icon: "💺", width: 120, height: 120, color: "rgba(212, 168, 67, 0.15)" },
  { type: "lighting", label: "Lighting", icon: "💡", width: 60, height: 60, color: "rgba(255, 220, 100, 0.25)" },
  { type: "floral", label: "Floral Decor", icon: "🌸", width: 80, height: 80, color: "rgba(219, 112, 147, 0.2)" },
  { type: "entry", label: "Entry Gate", icon: "🚪", width: 100, height: 40, color: "rgba(212, 168, 67, 0.25)" },
  { type: "table", label: "Round Table", icon: "⭕", width: 70, height: 70, color: "rgba(150, 150, 150, 0.2)" },
  { type: "buffet", label: "Buffet", icon: "🍽️", width: 160, height: 50, color: "rgba(180, 120, 60, 0.2)" },
  { type: "dance", label: "Dance Floor", icon: "💃", width: 140, height: 140, color: "rgba(130, 80, 200, 0.15)" },
];

const CANVAS_W = 800;
const CANVAS_H = 500;

const EventBuilder = () => {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addItem = (type: typeof BUILDER_ITEMS[number]) => {
    const newItem: CanvasItem = {
      id: `${type.type}-${Date.now()}`,
      type: type.type,
      label: type.label,
      icon: type.icon,
      x: CANVAS_W / 2 - type.width / 2,
      y: CANVAS_H / 2 - type.height / 2,
      width: type.width,
      height: type.height,
      color: type.color,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      e.preventDefault();
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging(itemId);
      setSelectedItem(itemId);
      setDragOffset({
        x: e.clientX - rect.left - item.x,
        y: e.clientY - rect.top - item.y,
      });
    },
    [items]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const item = items.find((i) => i.id === dragging);
      if (!item) return;
      const x = Math.max(0, Math.min(CANVAS_W - item.width, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(0, Math.min(CANVAS_H - item.height, e.clientY - rect.top - dragOffset.y));
      setItems((prev) => prev.map((i) => (i.id === dragging ? { ...i, x, y } : i)));
    },
    [dragging, dragOffset, items]
  );

  const handleMouseUp = () => setDragging(null);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const resetCanvas = () => {
    setItems([]);
    setSelectedItem(null);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("itemType");
      const builderItem = BUILDER_ITEMS.find((i) => i.type === type);
      if (!builderItem || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(CANVAS_W - builderItem.width, e.clientX - rect.left - builderItem.width / 2));
      const y = Math.max(0, Math.min(CANVAS_H - builderItem.height, e.clientY - rect.top - builderItem.height / 2));
      const newItem: CanvasItem = {
        id: `${builderItem.type}-${Date.now()}`,
        ...builderItem,
        x,
        y,
      };
      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Design Your Event</p>
            <h1 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
              Visual Event Builder
            </h1>
            <div className="gold-divider" />
            <p className="text-ivory/50 mt-4 max-w-lg mx-auto text-sm">
              Drag and drop elements to design your event layout. Click items to select, drag to reposition.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            {/* Sidebar - Item palette */}
            <div className="lg:w-64 shrink-0">
              <div className="glass-dark rounded-xl p-4 sticky top-24">
                <h3 className="font-heading text-sm text-gold uppercase tracking-wider mb-4">Elements</h3>
                <div className="space-y-2">
                  {BUILDER_ITEMS.map((item) => (
                    <motion.div
                      key={item.type}
                      draggable
                      onDragStart={(e: any) => {
                        e.dataTransfer?.setData("itemType", item.type);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addItem(item)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 bg-noir/60 hover:border-gold/50 cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <GripVertical size={14} className="text-ivory/30 group-hover:text-ivory/60" />
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-ivory/70 text-sm font-body">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={resetCanvas}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-ivory/50 hover:text-ivory border border-gold/10 hover:border-gold/30 transition-all"
                  >
                    <RotateCcw size={14} /> Reset Layout
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/10">
                  <p className="text-ivory/40 text-xs">
                    Items: {items.length} placed
                  </p>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-x-auto">
              <div
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative border-2 border-gold/20 rounded-2xl bg-noir/80 overflow-hidden mx-auto"
                style={{ width: CANVAS_W, height: CANVAS_H, minWidth: CANVAS_W }}
              >
                {/* Grid lines */}
                <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
                  {Array.from({ length: Math.floor(CANVAS_W / 50) + 1 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={CANVAS_H} stroke="hsla(43,72%,52%,0.06)" strokeWidth={1} />
                  ))}
                  {Array.from({ length: Math.floor(CANVAS_H / 50) + 1 }).map((_, i) => (
                    <line key={`h${i}`} x1={0} y1={i * 50} x2={CANVAS_W} y2={i * 50} stroke="hsla(43,72%,52%,0.06)" strokeWidth={1} />
                  ))}
                </svg>

                {items.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-ivory/20 pointer-events-none">
                    <div className="text-center">
                      <p className="font-heading text-lg mb-1">Drop elements here</p>
                      <p className="text-xs">Click or drag items from the sidebar</p>
                    </div>
                  </div>
                )}

                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`absolute flex flex-col items-center justify-center rounded-lg cursor-move select-none transition-shadow ${
                      selectedItem === item.id ? "ring-2 ring-gold shadow-gold" : "hover:ring-1 hover:ring-gold/40"
                    }`}
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      height: item.height,
                      backgroundColor: item.color,
                      border: "1px solid hsla(43,72%,52%,0.2)",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item.id)}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <span className="text-lg pointer-events-none">{item.icon}</span>
                    <span className="text-[10px] text-ivory/60 pointer-events-none mt-0.5">{item.label}</span>
                    {selectedItem === item.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground hover:scale-110 transition-transform"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default EventBuilder;
