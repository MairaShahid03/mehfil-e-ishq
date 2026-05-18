import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus, Trash2, Download, Share2, Heart, Grid3x3,
  List, Upload, Folder, X
} from "lucide-react";
import { toast } from "sonner";

interface MoodBoard {
  id: string;
  name: string;
  theme: string;
  images: string[];
  createdAt: Date;
  isFavorite: boolean;
}

interface MoodImage {
  id: string;
  url: string;
  category: string;
}

const sampleImages: MoodImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1519167758993-c1a1f5e5e8d0?w=300&h=300&fit=crop",
    category: "Decor",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&h=300&fit=crop",
    category: "Flowers",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1519914213614-c7d1a2827e90?w=300&h=300&fit=crop",
    category: "Lighting",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=300&fit=crop",
    category: "Seating",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&h=300&fit=crop",
    category: "Flowers",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1519914213614-c7d1a2827e90?w=300&h=300&fit=crop",
    category: "Lighting",
  },
];

const MoodBoardCreator = () => {
  const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([
    {
      id: "1",
      name: "Royal Gold Wedding",
      theme: "Traditional",
      images: [sampleImages[0].url, sampleImages[1].url, sampleImages[2].url],
      createdAt: new Date(),
      isFavorite: true,
    },
  ]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBoard, setSelectedBoard] = useState<MoodBoard | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    const newBoard: MoodBoard = {
      id: Date.now().toString(),
      name: newBoardName,
      theme: "Custom",
      images: [],
      createdAt: new Date(),
      isFavorite: false,
    };

    setMoodBoards([...moodBoards, newBoard]);
    setNewBoardName("");
    setShowCreateForm(false);
    toast.success("Mood board created!");
  };

  const handleAddImage = (boardId: string, imageUrl: string) => {
    setMoodBoards(
      moodBoards.map((board) =>
        board.id === boardId
          ? { ...board, images: [...board.images, imageUrl] }
          : board
      )
    );
    toast.success("Image added to board!");
  };

  const handleRemoveImage = (boardId: string, imageIndex: number) => {
    setMoodBoards(
      moodBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              images: board.images.filter((_, i) => i !== imageIndex),
            }
          : board
      )
    );
  };

  const handleDeleteBoard = (boardId: string) => {
    setMoodBoards(moodBoards.filter((b) => b.id !== boardId));
    if (selectedBoard?.id === boardId) {
      setSelectedBoard(null);
    }
    toast.success("Board deleted!");
  };

  const handleToggleFavorite = (boardId: string) => {
    setMoodBoards(
      moodBoards.map((board) =>
        board.id === boardId
          ? { ...board, isFavorite: !board.isFavorite }
          : board
      )
    );
  };

  return (
    <section className="section-padding bg-noir">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Creative Tools
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Mood Board Creator
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Boards List */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg text-ivory">My Boards</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="p-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              {/* Create Form */}
              <AnimatePresence>
                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 space-y-3"
                  >
                    <input
                      type="text"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      placeholder="Board name..."
                      className="w-full px-3 py-2 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateBoard}
                        className="flex-1 px-3 py-2 rounded-lg bg-gold text-noir text-sm font-semibold hover:bg-gold/90"
                      >
                        Create
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-ivory/10 text-ivory text-sm hover:bg-ivory/20"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Boards List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {moodBoards.map((board) => (
                  <motion.button
                    key={board.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedBoard(board)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedBoard?.id === board.id
                        ? "bg-gold/20 border border-gold/50"
                        : "bg-noir/30 hover:bg-noir/50 border border-gold/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-ivory font-body text-sm font-medium truncate">
                          {board.name}
                        </p>
                        <p className="text-ivory/50 text-xs">
                          {board.images.length} images
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(board.id);
                        }}
                        className="text-ivory/50 hover:text-gold"
                      >
                        <Heart
                          size={16}
                          className={board.isFavorite ? "fill-gold text-gold" : ""}
                        />
                      </motion.button>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Area - Board Editor */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedBoard ? (
                <motion.div
                  key={selectedBoard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass rounded-2xl p-8"
                >
                  {/* Board Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="font-heading text-2xl text-ivory mb-2">
                        {selectedBoard.name}
                      </h3>
                      <p className="text-ivory/60 text-sm">
                        {selectedBoard.theme} Theme
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30"
                      >
                        <Download size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30"
                      >
                        <Share2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleDeleteBoard(selectedBoard.id)
                        }
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Board Images */}
                  <div className="mb-8">
                    <p className="text-ivory/70 text-sm mb-4">
                      Board Images ({selectedBoard.images.length})
                    </p>
                    {selectedBoard.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedBoard.images.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                          >
                            <img
                              src={image}
                              alt={`Board image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-noir/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleRemoveImage(selectedBoard.id, idx)
                                }
                                className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600"
                              >
                                <X size={18} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-noir/30 rounded-lg">
                        <Folder size={40} className="mx-auto text-gold/30 mb-3" />
                        <p className="text-ivory/50 text-sm">
                          No images yet. Add images below!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Available Images to Add */}
                  <div>
                    <p className="text-ivory/70 text-sm mb-4">
                      Add Images to Board
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {sampleImages.map((image) => (
                        <motion.div
                          key={image.id}
                          whileHover={{ scale: 1.05 }}
                          onClick={() =>
                            handleAddImage(selectedBoard.id, image.url)
                          }
                          className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={image.url}
                            alt={image.category}
                            className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                          />
                          <div className="absolute inset-0 bg-noir/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus size={32} className="text-gold" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-noir/80 px-2 py-1 rounded text-ivory text-xs">
                            {image.category}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-12 text-center"
                >
                  <Folder size={48} className="mx-auto text-gold/30 mb-4" />
                  <p className="text-ivory/50 font-body text-lg">
                    Select a mood board to get started
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodBoardCreator;
