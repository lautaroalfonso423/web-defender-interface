
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

interface urlData {
    url: string;
    name: string;
}



export default function HomeView() {
    const [sites, setSites] = useState<SiteData[]>([]);
    const [url, setUrl] = useState<urlData>({url: "", name: ""});
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/sites/render');
      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error("Error cargando monitores", error);
    } finally {
      setLoading(false);
    }
  };

    const creationSite = async () => {
        try {
            const res = await fetch('http://localhost:3000/sites/creation', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(url), 
        });
            if (res.ok) {
            const data = await res.json();
            
            setModal(false);
            
            setUrl ({ url: '', name: '' });
            
            fetchData(); 
        }
        } catch (error) {
            console.error("Error al crear el sitio", error);
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
        <button
        onClick={() => setModal(true)}
        className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
        <span className="text-lg">+</span> Add Site
        </button>
        </header>
        
        {modal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600 text-sm">🌐</span>
                    Agregar nuevo sitio
                </h2>

                <div className="space-y-4">
                    {/* Campo URL */}
                    <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-600 ml-1">
                        URL de la página
                    </label>
                    <input 
                        name= "url"
                        type="url" 
                        onChange={(e) => setUrl({...url, url: e.target.value})}
                        placeholder="https://ejemplo.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                    </div>

                    {/* Campo Nombre */}
                    <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-600 ml-1">
                        Nombre del sitio
                    </label>
                    <input 
                        name="name"
                        type="text" 
                        onChange={(e) => setUrl({...url, name: e.target.value})}
                        placeholder="Mi Servidor API"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                   
                    <button 
                    onClick={creationSite}
                    className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95"
                    >
                    Guardar Monitor
                    </button>

                
                    <button 
                    onClick={() => setModal(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-lg transition-all"
                    >
                    Cancelar
                    </button>
                </div>
                </div>
            </div>
            )}
       
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
        
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}