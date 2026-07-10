import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export function StockLedgerPage() {
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const res = await api.get('/stock-ledger');
      setLedger(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Ledger</h1>
        <p className="text-muted-foreground mt-1">Immutable history of all stock movements and adjustments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Real-time view of stock adjustments, transfers, issues, and receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">In</th>
                  <th className="px-4 py-3 text-right">Out</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3 font-medium text-foreground">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.product?.name || 'N/A'}</td>
                    <td className="px-4 py-3">{item.warehouse?.name || 'N/A'}</td>
                    <td className="px-4 py-3 capitalize">{item.transaction_type}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">+{item.quantity_in}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">-{item.quantity_out}</td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">{item.balance}</td>
                  </tr>
                ))}
                {ledger.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      No stock transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
