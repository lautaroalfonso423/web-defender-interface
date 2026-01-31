
"use client";
import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';


interface LatencyPoint {
  time: string;
  ms: number;
}

interface SiteData {
  id: string;
  name: string;
  url: string;
  status: number;
  uptime: string | number;
  latencyData: LatencyPoint[];
}



export default function HomeView() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/sites/render'); // Tu ruta de Nest
      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error("Error cargando monitores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refrescar cada 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10">Cargando monitores...</div>;

 

return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-blue-600" /> System Health
        </h1>
        <p className="text-slate-500 text-sm">Monitoreo en tiempo real de servicios</p>
      </header>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div 
            key={site.id} 
            className={`bg-white rounded-xl shadow-sm border-2 transition-all p-5 ${
              site.status === 200 ? 'border-green-100 hover:border-green-400' : 'border-red-100 hover:border-red-400'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{site.name}</h3>
                <p className="text-xs text-slate-400 truncate w-40">{site.url}</p>
              </div>
              {site.status === 200 ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : (
                <AlertCircle className="text-red-500" size={24} />
              )}
            </div>

            {/* Contador de Uptime */}
            <div className="mb-4">
              <span className="text-3xl font-black text-slate-700">{site.uptime}%</span>
              <span className="text-xs text-slate-400 ml-2 uppercase tracking-wider font-semibold">Uptime</span>
            </div>

            {/* Gráfico de Latencia Mini */}
            <div className="h-24 w-full bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-tighter">Latencia (ms)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={site.latencyData}>
                  <Line 
                    type="monotone" 
                    dataKey="ms" 
                    stroke={site.status === 200 ? "#22c55e" : "#ef4444"} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }} 
                    labelStyle={{ display: 'none' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs">
                <span className={`px-2 py-1 rounded-full font-bold ${
                    site.status === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    Status: {site.status === 0 ? 'Timeout' : site.status}
                </span>
                <span className="text-slate-400 italic">Actualizado hace 1 min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}