import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

export function WarehousePage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/warehouses');
      setWarehouses(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage physical locations, zones, racks, and bins.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map(wh => (
          <Card key={wh.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                {wh.name} ({wh.code})
              </CardTitle>
              <CardDescription>{wh.type || 'Standard Warehouse'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Zones: {wh.zones?.length || 0}</p>
                <p>Address: {wh.address || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {warehouses.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            No warehouses configured. Click "Add Warehouse" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
