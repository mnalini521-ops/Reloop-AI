import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Recycle, ShoppingBag, HeartHandshake, Award, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', recycled: 40, sold: 24, exchanged: 24, donated: 10 },
  { name: 'Tue', recycled: 30, sold: 13, exchanged: 22, donated: 15 },
  { name: 'Wed', recycled: 20, sold: 98, exchanged: 22, donated: 20 },
  { name: 'Thu', recycled: 27, sold: 39, exchanged: 20, donated: 12 },
  { name: 'Fri', recycled: 18, sold: 48, exchanged: 21, donated: 18 },
  { name: 'Sat', recycled: 23, sold: 38, exchanged: 25, donated: 25 },
  { name: 'Sun', recycled: 34, sold: 43, exchanged: 21, donated: 30 },
];

const pieData = [
  { name: 'Recycled', value: 400, color: '#00C896' },
  { name: 'Sold', value: 300, color: '#3b82f6' },
  { name: 'Exchanged', value: 300, color: '#f59e0b' },
  { name: 'Donated', value: 200, color: '#ec4899' },
];

const ImpactDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 h-[400px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Weekly Activity
            </h3>
            <div className="text-xs text-white/40 font-bold uppercase tracking-widest">Last 7 Days</div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1c20', 
                  border: '1px solid #ffffff10', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="recycled" fill="#00C896" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exchanged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Impact Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 h-[400px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Impact Distribution
            </h3>
            <div className="text-xs text-white/40 font-bold uppercase tracking-widest">By Category</div>
          </div>
          <div className="flex h-full items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1c20', 
                    border: '1px solid #ffffff10', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-8">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-white/40">{item.value} units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reward Points Trend Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 h-[350px]"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Reward Points Distribution
          </h3>
          <div className="text-xs text-white/40 font-bold uppercase tracking-widest">Monthly Growth</div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1c20', 
                border: '1px solid #ffffff10', 
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="recycled" stroke="#00C896" fillOpacity={1} fill="url(#colorPoints)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-lg">Detailed Activity Log</h3>
          <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Condition</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Impact</th>
                <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: '2024-03-24', type: 'Recycle', product: 'iPhone 12', condition: 'Broken Screen', impact: '+450 pts', status: 'Completed', color: 'text-emerald-400' },
                { date: '2024-03-23', type: 'Sell', product: 'MacBook Pro', condition: 'Like New', impact: '$850.00', status: 'In Review', color: 'text-blue-400' },
                { date: '2024-03-22', type: 'Exchange', product: 'iPad Air', condition: 'Good', impact: '-$120.00', status: 'Arriving Today', color: 'text-yellow-400' },
                { date: '2024-03-21', type: 'Donation', product: 'Cash', condition: 'N/A', impact: '₹500.00', status: 'Completed', color: 'text-pink-400' },
                { date: '2024-03-20', type: 'Recycle', product: 'Old Batteries', condition: 'N/A', impact: '+120 pts', status: 'Completed', color: 'text-emerald-400' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-white/60">{row.date}</td>
                  <td className="px-6 py-4">
                    <div className={cn("text-xs font-bold px-2 py-1 rounded-lg inline-block bg-white/5", row.color)}>
                      {row.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{row.product}</td>
                  <td className="px-6 py-4 text-sm text-white/40">{row.condition}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">{row.impact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", row.status === 'Completed' ? "bg-emerald-400" : "bg-yellow-400")} />
                      <span className="text-xs font-bold text-white/60">{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactDashboard;
