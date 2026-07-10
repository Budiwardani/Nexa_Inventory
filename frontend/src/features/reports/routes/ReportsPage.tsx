import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, Download, RefreshCw } from 'lucide-react';

export function ReportsPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'ledger' | 'transfers' | 'adjustments'>('summary');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, lRes, aRes, tRes] = await Promise.all([
        api.get('/stocks'),
        api.get('/stock-ledger'),
        api.get('/stock-adjustments'),
        api.get('/stock-transfers'),
      ]);
      setStocks(sRes.data?.data || sRes.data || []);
      setLedger(lRes.data?.data || lRes.data || []);
      setAdjustments(aRes.data?.data || aRes.data || []);
      setTransfers(tRes.data?.data || tRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const tabs = [
    { key: 'summary', label: 'Stock Summary' },
    { key: 'ledger', label: 'Stock Ledger' },
    { key: 'transfers', label: 'Transfer History' },
    { key: 'adjustments', label: 'Adjustment Log' },
  ];

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return alert('No data to export');
    const keys = Object.keys(data[0]);
    const rows = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = (data: any[]) => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(item => JSON.stringify(item).toLowerCase().includes(q));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Inventory reports — stock summary, ledger, transfers, and adjustments.</p>
        </div>
        <Button variant="outline" onClick={fetchAll} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products in Stock', value: stocks.length, color: 'text-indigo-600' },
          { label: 'Total Ledger Entries', value: ledger.length, color: 'text-blue-600' },
          { label: 'Total Transfers', value: transfers.length, color: 'text-teal-600' },
          { label: 'Total Adjustments', value: adjustments.length, color: 'text-orange-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === t.key ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + Export */}
      <div className="flex gap-3">
        <Input className="max-w-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" size="sm" onClick={() => {
          const datasets: Record<string, any[]> = { summary: stocks, ledger, transfers, adjustments };
          exportCSV(filtered(datasets[activeTab]), activeTab);
        }}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stock Summary */}
      {activeTab === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-indigo-600" /> Stock Summary</CardTitle>
            <CardDescription>Current on-hand quantities per product and warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Warehouse</th>
                    <th className="px-4 py-3 text-left">Batch</th>
                    <th className="px-4 py-3 text-right">On Hand</th>
                    <th className="px-4 py-3 text-right">Reserved</th>
                    <th className="px-4 py-3 text-right">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(stocks).map((s: any) => (
                    <tr key={s.id} className="border-b hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{s.product?.name || s.product_id}</td>
                      <td className="px-4 py-3">{s.warehouse?.name || s.warehouse_id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.batch_number || '—'}</td>
                      <td className="px-4 py-3 text-right font-mono">{Number(s.quantity_on_hand).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-orange-600">{Number(s.quantity_reserved || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-green-700">{Number(s.quantity_available || s.quantity_on_hand).toLocaleString()}</td>
                    </tr>
                  ))}
                  {filtered(stocks).length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No stock data found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ledger */}
      {activeTab === 'ledger' && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Ledger</CardTitle>
            <CardDescription>Immutable log of all stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Warehouse</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-right">In</th>
                    <th className="px-4 py-3 text-right">Out</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(ledger).map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(item.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{item.product?.name || item.product_id}</td>
                      <td className="px-4 py-3">{item.warehouse?.name || item.warehouse_id}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-muted capitalize">{item.transaction_type}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 font-mono">{Number(item.quantity_in) > 0 ? `+${Number(item.quantity_in).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-mono">{Number(item.quantity_out) > 0 ? `-${Number(item.quantity_out).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-right font-bold font-mono">{Number(item.balance).toLocaleString()}</td>
                    </tr>
                  ))}
                  {filtered(ledger).length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No ledger entries found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transfer History */}
      {activeTab === 'transfers' && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer History</CardTitle>
            <CardDescription>All stock transfer transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Number</th>
                    <th className="px-4 py-3 text-left">Source</th>
                    <th className="px-4 py-3 text-left">Destination</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(transfers).map((t: any) => (
                    <tr key={t.id} className="border-b hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium font-mono">{t.transfer_number}</td>
                      <td className="px-4 py-3">{t.sourceWarehouse?.name || t.source_warehouse_id}</td>
                      <td className="px-4 py-3">
                        {t.destination_type === 'department'
                          ? `Dept: ${t.destinationDepartment?.name || '—'}`
                          : t.destinationWarehouse?.name || '—'}
                      </td>
                      <td className="px-4 py-3 capitalize">{t.status}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filtered(transfers).length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No transfers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adjustment Log */}
      {activeTab === 'adjustments' && (
        <Card>
          <CardHeader>
            <CardTitle>Adjustment Log</CardTitle>
            <CardDescription>All stock adjustment records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Number</th>
                    <th className="px-4 py-3 text-left">Warehouse</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(adjustments).map((a: any) => (
                    <tr key={a.id} className="border-b hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium font-mono">{a.adjustment_number}</td>
                      <td className="px-4 py-3">{a.warehouse?.name || a.warehouse_id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.reason || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${a.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filtered(adjustments).length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No adjustments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
