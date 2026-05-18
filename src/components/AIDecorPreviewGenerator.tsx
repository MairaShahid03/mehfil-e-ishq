import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Wand2, Download, Share2, Loader2, X,
  Sparkles, Image as ImageIcon, Palette
} from "lucide-react";
import { toast } from "sonner";

interface DecorPreview {
  id: string;
  originalImage: string;
  theme: string;
  decoratedImage: string;
  isGenerating: boolean;
}

const decorThemes = [
  {
    id: "royal-gold",
    name: "Royal Gold",
    description: "Luxurious gold and cream theme",
    colors: ["#D4AF37", "#FFF8DC", "#2C2C2C"],
  },
  {
    id: "floral-pastel",
    name: "Floral Pastel",
    description: "Soft pink and white florals",
    colors: ["#FFB6C1", "#FFF0F5", "#FFFFFF"],
  },
  {
    id: "mughal",
    name: "Mughal",
    description: "Rich reds and emerald greens",
    colors: ["#8B0000", "#228B22", "#FFD700"],
  },
  {
    id: "arabian-nights",
    name: "Arabian Nights",
    description: "Deep purples and gold accents",
    colors: ["#663399", "#FFD700", "#1C1C1C"],
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean whites and blacks",
    colors: ["#FFFFFF", "#000000", "#808080"],
  },
  {
    id: "garden-romance",
    name: "Garden Romance",
    description: "Blush and sage green",
    colors: ["#F5E6E8", "#9CAF88", "#E8D5C4"],
  },
];

const AIDecorPreviewGenerator = () => {
  const [previews, setPreviews] = useState<DecorPreview[]>([
    {
      id: "1",
      originalImage:
        "https://images.unsplash.com/photo-1519167758993-c1a1f5e5e8d0?w=600&h=400&fit=crop",
      theme: "royal-gold",
      decoratedImage:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop",
      isGenerating: false,
    },
  ]);

  const [selectedTheme, setSelectedTheme] = useState("royal-gold");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<DecorPreview | null>(
    null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePreview = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const newPreview: DecorPreview = {
        id: Date.now().toString(),
        originalImage: uploadedImage,
        theme: selectedTheme,
        decoratedImage:
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop",
        isGenerating: false,
      };

      setPreviews([...previews, newPreview]);
      setSelectedPreview(newPreview);
      setIsGenerating(false);
      setUploadedImage(null);
      toast.success("Decor preview generated successfully!");
    }, 3000);
  };

  const handleDeletePreview = (id: string) => {
    setPreviews(previews.filter((p) => p.id !== id));
    if (selectedPreview?.id === id) {
      setSelectedPreview(null);
    }
    toast.success("Preview deleted!");
  };

  const currentTheme = decorThemes.find((t) => t.id === selectedTheme);

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
            AI Powered
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Decor Preview Generator
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto">
            Visualize your venue with different decoration themes using AI
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload & Generate Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              {/* Image Upload */}
              <div>
                <h3 className="font-heading text-lg text-ivory mb-4">
                  Upload Venue Image
                </h3>
                <label className="block">
                  <div className="border-2 border-dashed border-gold/30 rounded-xl p-6 text-center cursor-pointer hover:border-gold/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadedImage ? (
                      <div className="space-y-2">
                        <Sparkles className="mx-auto text-gold" size={32} />
                        <p className="text-ivory text-sm font-semibold">
                          Image Ready
                        </p>
                        <p className="text-ivory/50 text-xs">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto text-gold/50" size={32} />
                        <p className="text-ivory/70 text-sm">
                          Click to upload venue image
                        </p>
                        <p className="text-ivory/40 text-xs">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Theme Selection */}
              <div>
                <h3 className="font-heading text-lg text-ivory mb-4">
                  Select Theme
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {decorThemes.map((theme) => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedTheme === theme.id
                          ? "bg-gold/20 border border-gold/50"
                          : "bg-noir/30 hover:bg-noir/50 border border-gold/10"
                      }`}
                    >
                      <p className="text-ivory font-body text-sm font-medium">
                        {theme.name}
                      </p>
                      <p className="text-ivory/50 text-xs">
                        {theme.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {theme.colors.map((color) => (
                          <div
                            key={color}
                            className="w-4 h-4 rounded-full border border-ivory/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGeneratePreview}
                disabled={!uploadedImage || isGenerating}
                className="btn-luxury w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Generate Preview
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Preview Display */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedPreview ? (
                <motion.div
                  key={selectedPreview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-heading text-2xl text-ivory mb-2">
                        Preview Result
                      </h3>
                      <p className="text-ivory/60 text-sm">
                        {
                          decorThemes.find((t) => t.id === selectedPreview.theme)
                            ?.name
                        }{" "}
                        Theme
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPreview(null)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  {/* Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Original */}
                    <div>
                      <p className="text-ivory/70 text-sm mb-3">Original</p>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-gold/20">
                        <img
                          src={selectedPreview.originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Decorated */}
                    <div>
                      <p className="text-ivory/70 text-sm mb-3">
                        With {currentTheme?.name} Decor
                      </p>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-gold/20">
                        <img
                          src={selectedPreview.decoratedImage}
                          alt="Decorated"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noir/20 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Theme Details */}
                  {currentTheme && (
                    <div className="bg-noir/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette size={18} className="text-gold" />
                        <p className="text-ivory font-semibold">
                          Color Palette
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {currentTheme.colors.map((color) => (
                          <div
                            key={color}
                            className="flex items-center gap-2 p-2 rounded-lg bg-noir/50"
                          >
                            <div
                              className="w-8 h-8 rounded border border-ivory/20"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-ivory/70 text-xs font-mono">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-luxury flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Preview
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-luxury-outline text-ivory border-ivory/50 hover:bg-ivory/10 flex items-center justify-center gap-2"
                    >
                      <Share2 size={18} />
                      Share
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-12 text-center"
                >
                  <ImageIcon size={48} className="mx-auto text-gold/30 mb-4" />
                  <p className="text-ivory/50 font-body text-lg">
                    Upload an image and select a theme to generate a preview
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Previous Previews */}
            {previews.length > 1 && (
              <div className="mt-8">
                <p className="text-ivory/70 text-sm mb-4">Previous Previews</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((preview) => (
                    <motion.div
                      key={preview.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedPreview(preview)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-gold/20 hover:border-gold/50 transition-all"
                    >
                      <img
                        src={preview.decoratedImage}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                      />
                      <div className="absolute inset-0 bg-noir/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-ivory text-xs font-semibold">
                          {
                            decorThemes.find((t) => t.id === preview.theme)
                              ?.name
                          }
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDecorPreviewGenerator;
