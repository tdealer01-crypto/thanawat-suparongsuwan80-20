import { useEffect, useState } from 'react';

export default function RuntimeMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/runtime/core/monitor');
        if (!response.ok) throw new Error('Failed to fetch monitoring data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-400">Loading runtime data...</div>;
  if (error) return <div className="text-rose-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold mb-4">Runtime Monitor</h3>
      <pre className="text-xs font-mono text-slate-600 bg-slate-100 p-4 rounded-lg overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
