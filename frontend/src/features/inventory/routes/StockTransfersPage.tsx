import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Plus, Truck, Check } from 'lucide-react';

export function StockTransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await api.get('/stock-transfers');
      setTransfers(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShip = async (id: number) => {
    try {
      await api.post(`/stock-transfers/${id}/ship`);
      fetchTransfers();
    } catch (e) {
      console.error(e);
      alert('Failed to ship transfer');
    }
  };

  const handleReceive = async (id: number) => {
    try {
      await api.post(`/stock-transfers/${id}/receive`, { received_quantities: [] });
      fetchTransfers();
    } catch (e) {
      console.error(e);
      alert('Failed to receive transfer');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage stock movements between warehouses.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transfers.map(trf => (
          <Card key={trf.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                  {trf.transfer_number}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full \${
                  trf.status === 'received' ? 'bg-green-100 text-green-700' : 
                  trf.status === 'intransit' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {trf.status.toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription>
                {trf.sourceWarehouse?.name} → {trf.destinationWarehouse?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Items: {trf.items?.length || 0}</p>
                {trf.status === 'draft' && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleShip(trf.id)}>
                    <Truck className="mr-2 h-4 w-4" /> Ship Transfer
                  </Button>
                )}
                {trf.status === 'intransit' && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleReceive(trf.id)}>
                    <Check className="mr-2 h-4 w-4" /> Receive Transfer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {transfers.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            No stock transfers found. Click "New Transfer" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
