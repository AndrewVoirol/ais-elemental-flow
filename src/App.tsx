import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { elements, ElementData } from "./data/elements";
import { Search } from "lucide-react";

export default function App() {
  const [layoutMode, setLayoutMode] = useState<"grid" | "particles">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<ElementData | null>(null);
  const [pinnedElement, setPinnedElement] = useState<ElementData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const displayedElement = pinnedElement || activeElement;

  const filteredElements = useMemo(() => {
    return elements.filter(el => {
      const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           el.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? el.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(elements.map(el => el.category));
    return Array.from(cats);
  }, []);

  const handleElementClick = useCallback((el: ElementData) => {
    setPinnedElement(prev => prev?.number === el.number ? null : el);
  }, []);

  const handleBackdropClick = useCallback(() => {
    setPinnedElement(null);
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans select-none bg-[#050505]" onClick={handleBackdropClick}>
      {/* Background Watermark */}
      <AnimatePresence mode="wait">
        {displayedElement && (
          <motion.div
            key={displayedElement.number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.07, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[480px] font-black text-white leading-none z-0 pointer-events-none"
          >
            {displayedElement.number}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 sm:px-10 py-6 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between z-40 relative gap-4">
        <div className="flex flex-col">
          <h1 className="text-xs uppercase tracking-[0.5em] font-black text-slate-500">Elemental Flow</h1>
          <span className="text-[10px] font-mono text-cyan-500 mt-1 uppercase tracking-widest">Simulation v4.02 // Periodic Flux</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyan-500/50" />
            <input 
              type="text"
              placeholder="SEARCH RESONANCE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-white/10 py-1 pl-8 pr-2 text-[10px] font-mono tracking-widest focus:outline-none focus:border-cyan-500 transition-colors w-40 sm:w-64 placeholder:text-slate-700"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-slate-800"></div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">System: {layoutMode === "grid" ? "Stable" : "Fluid"}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); setLayoutMode(prev => prev === "grid" ? "particles" : "grid"); }}
              className={`w-2 h-2 rounded-full transition-all shadow-[0_0_8px_rgba(34,197,94,0.6)] ${layoutMode === "grid" ? "bg-green-500" : "bg-cyan-500"}`}
              aria-label={`Switch to ${layoutMode === "grid" ? "fluid" : "stable"} mode`}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden px-6 sm:px-10 pb-10">
        {/* Scrollable container for the periodic table */}
        <div className="relative w-full h-[calc(100%-80px)] overflow-x-auto overflow-y-auto">
          <div className="relative" style={{ minWidth: '1240px', minHeight: '520px' }}>
            <AnimatePresence>
              {filteredElements.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="text-6xl mb-4 opacity-20">⚛</div>
                  <p className="text-sm font-mono uppercase tracking-widest text-slate-500">No elements match resonance pattern</p>
                  <p className="text-xs text-slate-600 mt-2 font-mono">"{searchQuery}"</p>
                </motion.div>
              ) : (
                filteredElements.map((el, index) => (
                  <ElementCard 
                    key={el.number} 
                    element={el} 
                    layoutMode={layoutMode} 
                    isHighlighted={selectedCategory === el.category || !selectedCategory}
                    isActive={displayedElement?.number === el.number}
                    onHover={() => setActiveElement(el)}
                    onLeave={() => { if (!pinnedElement) setActiveElement(null); }}
                    onClick={() => handleElementClick(el)}
                    staggerIndex={index}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Element Info Overlay - Artistic Theme Integration */}
        <AnimatePresence>
          {displayedElement && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl grid grid-cols-12 gap-4 sm:gap-10 items-end pointer-events-none z-50 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="col-span-12 sm:col-span-8 flex items-baseline gap-6 mb-[-10px]">
                 <span 
                    className="text-[80px] sm:text-[160px] font-bold leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    style={{ color: displayedElement.color }}
                  >
                    {displayedElement.symbol}
                  </span>
                  <div className="flex flex-col pb-2 sm:pb-6">
                    <span className="text-2xl sm:text-5xl font-serif italic text-slate-100">{displayedElement.name}</span>
                    <span className="text-xs font-mono tracking-[0.3em] uppercase mt-2 sm:mt-4" style={{ color: displayedElement.color }}>
                      {displayedElement.category.replace(/-/g, ' ')}
                    </span>
                    <div className="mt-3 sm:mt-6 max-w-sm pl-4 border-l border-white/10 hidden sm:block">
                      <p className="text-xs text-slate-400 leading-relaxed font-light tracking-wide uppercase opacity-70">
                        Atomic simulation of {displayedElement.name} ({displayedElement.symbol}) detected within structural lattice mode. Resonance frequency stable at {displayedElement.weight} units.
                      </p>
                    </div>
                  </div>
              </div>

              <div className="col-span-12 sm:col-span-4 pb-4 sm:pb-10">
                <div className="p-4 sm:p-6 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-sm w-full grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Atomic Mass</span>
                      <p className="text-xl font-light text-slate-200">{displayedElement.weight} u</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Group</span>
                      <p className="text-xl font-light text-slate-200">{displayedElement.group}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Number</span>
                      <p className="text-xl font-light text-slate-200">{displayedElement.number}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Status</span>
                      <p className="text-xl font-serif italic text-slate-400">{pinnedElement?.number === displayedElement.number ? 'Locked' : 'Stable'}</p>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 sm:px-10 py-6 sm:py-8 border-t border-slate-900 flex justify-between items-center bg-black/40 backdrop-blur-xl z-50">
        <nav className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); }}
            className={`text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${!selectedCategory ? "text-cyan-400 border-b border-cyan-400 pb-1" : "text-slate-500 hover:text-slate-300"}`}
          >
            Universal
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); }}
              className={`text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${selectedCategory === cat ? "text-white border-b border-white pb-1" : "text-slate-500 hover:text-slate-300"}`}
              style={{ color: selectedCategory === cat ? `var(--color-element-${cat.split('-')[0]})` : "", borderColor: selectedCategory === cat ? `var(--color-element-${cat.split('-')[0]})` : "" }}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </nav>
        
        <div className="hidden sm:flex items-center gap-6 pl-8 border-l border-white/5">
          <div className="text-right">
            <div className="text-[9px] text-slate-500 uppercase tracking-widest">Active Filters</div>
            <div className="text-xs font-mono text-slate-400 uppercase">{selectedCategory ? selectedCategory.replace(/-/g, ' ') : 'None'}</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center p-1.5 opacity-50">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-800 to-slate-400"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ElementCardProps {
  key?: React.Key;
  element: ElementData;
  layoutMode: "grid" | "particles";
  isHighlighted: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  staggerIndex: number;
}

function ElementCard({ 
  element, 
  layoutMode, 
  isHighlighted, 
  isActive,
  onHover, 
  onLeave,
  onClick,
  staggerIndex
}: ElementCardProps) {
  const cellSize = 56;
  const gap = 12;
  
  const x = (element.group - 1) * (cellSize + gap);
  const y = (element.period - 1) * (cellSize + gap);

  const randomDrift = useMemo(() => ({
    x: Math.random() * 800 - 400,
    y: Math.random() * 500 - 250,
    rotate: Math.random() * 90 - 45,
    scale: 0.8 + Math.random() * 0.4
  }), []);

  // Use proper keyframe arrays for continuous fluid animation
  const driftAnimate = layoutMode === "particles" ? {
    x: [randomDrift.x + 400, randomDrift.x + 415, randomDrift.x + 400, randomDrift.x + 385, randomDrift.x + 400],
    y: [randomDrift.y + 200, randomDrift.y + 185, randomDrift.y + 200, randomDrift.y + 215, randomDrift.y + 200],
    rotate: [randomDrift.rotate, randomDrift.rotate + 10, randomDrift.rotate, randomDrift.rotate - 10, randomDrift.rotate],
  } : {
    x: x,
    y: y,
    rotate: 0,
  };

  return (
    <motion.div
      layoutId={`card-${element.number}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isHighlighted ? 1 : 0.1,
        scale: isHighlighted ? 1 : 0.8,
        ...driftAnimate
      }}
      transition={{ 
        type: "spring", 
        stiffness: 40, 
        damping: 12,
        opacity: { duration: 0.3, delay: staggerIndex * 0.008 },
        scale: { delay: staggerIndex * 0.008 },
        rotate: layoutMode === "particles" ? { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" } : { type: "spring" },
        x: layoutMode === "particles" ? { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" } : { type: "spring" },
        y: layoutMode === "particles" ? { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" } : { type: "spring" },
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`absolute w-[56px] h-[56px] border flex flex-col items-center justify-center cursor-crosshair group transition-all duration-500 backdrop-blur-[2px] ${isActive ? "z-50 glow-card scale-125 border-opacity-100 bg-white/10" : "bg-white/[0.02] border-opacity-20 hover:border-opacity-40"}`}
      style={{ 
        borderColor: element.color,
        color: isActive ? "#fff" : element.color
      }}
    >
      <span className="absolute top-1 left-1.5 text-[7px] font-mono opacity-50">{element.number}</span>
      <span className="text-xl font-bold tracking-tighter leading-none mb-0.5">{element.symbol}</span>
      <span className="text-[6px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">{element.name}</span>
    </motion.div>
  );
}
