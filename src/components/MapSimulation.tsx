import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Info, Filter, Search, Layers, Activity, Recycle, ArrowLeftRight } from 'lucide-react';
import { cn } from '../lib/utils';

const MapSimulation = () => {
  const [filter, setFilter] = useState<'all' | 'recycle' | 'exchange'>('all');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const points = [
    { id: 1, type: 'recycle', x: 200, y: 150, name: 'Eco-Green Center', address: '123 Green St', distance: '1.2 km', activity: 'High' },
    { id: 2, type: 'exchange', x: 450, y: 300, name: 'ReLoop Hub', address: '45 Tech Ave', distance: '2.5 km', activity: 'Medium' },
    { id: 3, type: 'recycle', x: 600, y: 100, name: 'Battery Drop-off', address: '88 Power Rd', distance: '3.8 km', activity: 'Low' },
    { id: 4, type: 'exchange', x: 150, y: 400, name: 'Smart Exchange', address: '12 Main St', distance: '0.8 km', activity: 'High' },
    { id: 5, type: 'recycle', x: 700, y: 350, name: 'E-Waste Bin', address: 'Park Plaza', distance: '5.2 km', activity: 'Medium' },
  ];

  const filteredPoints = filter === 'all' ? points : points.filter(p => p.type === filter);

  return (
    <div className="glass-card aspect-video relative overflow-hidden rounded-3xl bg-[#1a1c20]">
      {/* Mock Map Background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Heatmap Simulation */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary/15 rounded-full blur-[80px] animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Map Points */}
      {filteredPoints.map((point) => (
        <motion.div
          key={point.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: point.id * 0.1 }}
          className="absolute cursor-pointer group"
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
          onClick={() => setSelectedPoint(point)}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-125 group-hover:z-50",
            point.type === 'recycle' ? "bg-emerald-500 shadow-emerald-500/40" : "bg-primary shadow-primary/40"
          )}>
            {point.type === 'recycle' ? <Recycle className="text-white w-5 h-5" /> : <Navigation className="text-white w-5 h-5" />}
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
            {point.name}
          </div>
        </motion.div>
      ))}

      {/* User Location */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50"
      >
        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 border-2 border-white" />
      </motion.div>

      {/* Map Controls */}
      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <div className="glass p-1 rounded-xl flex">
          <button onClick={() => setFilter('all')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'all' ? "bg-white/10 text-white" : "text-white/40")}>All</button>
          <button onClick={() => setFilter('recycle')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'recycle' ? "bg-emerald-500 text-white" : "text-white/40")}>Recycle</button>
          <button onClick={() => setFilter('exchange')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'exchange' ? "bg-primary text-white" : "text-white/40")}>Exchange</button>
        </div>
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={cn("glass p-3 rounded-xl flex items-center gap-2 transition-all", showHeatmap ? "bg-primary/20 border-primary/40 text-primary" : "text-white/40")}
        >
          <Activity className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Heatmap</span>
        </button>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <div className="glass p-2 rounded-xl flex flex-col gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Search className="w-5 h-5 text-white/40" /></button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Layers className="w-5 h-5 text-white/40" /></button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Navigation className="w-5 h-5 text-white/40" /></button>
        </div>
      </div>

      {/* Selected Point Info */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div 
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 glass-card m-4 p-6 bg-black/60 backdrop-blur-xl z-[60]"
          >
            <button onClick={() => setSelectedPoint(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <Info className="w-5 h-5" />
            </button>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
              selectedPoint.type === 'recycle' ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"
            )}>
              {selectedPoint.type === 'recycle' ? <Recycle className="w-6 h-6" /> : <Navigation className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-bold mb-2">{selectedPoint.name}</h3>
            <p className="text-sm text-white/40 mb-6">{selectedPoint.address}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Distance</span>
                <span className="font-bold text-white">{selectedPoint.distance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Activity Level</span>
                <span className="font-bold text-primary">{selectedPoint.activity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Wait Time</span>
                <span className="font-bold text-white">~15 mins</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20">Navigate</button>
              <button className="flex-1 py-3 glass text-white rounded-xl text-xs font-bold">Details</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapSimulation;
