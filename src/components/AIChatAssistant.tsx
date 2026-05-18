import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Loader2, Minimize2, Maximize2,
  Bot, User
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Assalam o Alaikum! 👋 Welcome to Mehfil-e-Ishq. I'm your AI wedding assistant. How can I help you today? I can assist with:\n\n• Package recommendations\n• Venue suggestions\n• Theme ideas\n• Event planning tips\n• Booking inquiries",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! For a wedding of 200-300 guests, I'd recommend our Premium Package which includes venue, catering, and full decoration services.",
        "Based on your preferences, I think a Royal Gold or Mughal theme would be perfect for your event. Would you like to see some inspiration images?",
        "We have several beautiful venues available in Karachi with capacities ranging from 200 to 500 guests. What's your preferred location?",
        "I can help you with that! Our team specializes in creating unforgettable moments. Would you like to book a consultation with our event planners?",
        "Excellent choice! Let me connect you with our team to discuss your specific requirements and create a customized package for you.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-gold text-noir shadow-2xl hover:shadow-gold/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulsing luxurious golden outer ring */}
            <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping opacity-75 pointer-events-none" />
            <Bot size={24} className="relative z-10 transition-transform duration-300 group-hover:rotate-12" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed z-50 ${
              isMinimized
                ? "bottom-6 left-6 w-80"
                : "bottom-6 left-6 w-96 h-[600px] flex flex-col"
            } bg-noir border border-gold/30 rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-b border-gold/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/20">
                  <Bot size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-ivory font-semibold">
                    Mehfil Assistant
                  </h3>
                  <p className="text-ivory/50 text-xs">Always here to help</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg hover:bg-ivory/10 text-ivory/70 hover:text-ivory transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-ivory/10 text-ivory/70 hover:text-ivory transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.type === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                          <Bot size={16} className="text-gold" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gold text-noir rounded-br-none"
                            : "bg-ivory/10 text-ivory rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.type === "user"
                              ? "text-noir/60"
                              : "text-ivory/50"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.type === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                          <User size={16} className="text-gold" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <Bot size={16} className="text-gold" />
                      </div>
                      <div className="bg-ivory/10 text-ivory rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                          <div
                            className="w-2 h-2 rounded-full bg-gold animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-gold animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gold/20 p-4 bg-noir/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask me anything..."
                      className="flex-1 px-4 py-2 rounded-lg bg-ivory/5 border border-gold/20 text-ivory placeholder:text-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className="p-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
