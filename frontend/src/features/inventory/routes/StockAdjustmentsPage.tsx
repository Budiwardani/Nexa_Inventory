import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileEdit, Plus, Check } from 'lucide-react';

export function StockAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([]);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const res = await api.get('/stock-adjustments');
      setAdjustments(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePost = async (id: number) => {
    try {
      await api.post(`/stock-adjustments/${id}/post`);
      fetchAdjustments();
    } catch (e) {
      console.error(e);
      alert('Failed to post adjustment');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments</h1>
          <p className="text-muted-foreground mt-1">Manage manual stock adjustments for damages or cycle counts.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Adjustment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adjustments.map(adj => (
          <Card key={adj.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-indigo-600" />
                  {adj.adjustment_number}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full \${adj.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {adj.status.toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription>
                Warehouse: {adj.warehouse?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Reason: {adj.reason || 'N/A'}</p>
                <p>Items: {adj.items?.length || 0}</p>
                {adj.status === 'draft' && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handlePost(adj.id)}>
                    <Check className="mr-2 h-4 w-4" /> Post Adjustment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {adjustments.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            No stock adjustments found. Click "New Adjustment" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
