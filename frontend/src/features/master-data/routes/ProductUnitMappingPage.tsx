import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from 'lucide-react';

export function ProductUnitMappingPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Unit Configuration</h1>
        <p className="text-muted-foreground mt-1">Map default units for Purchase, Sales, Inventory, and Production per product.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            The comprehensive product master configuration will be implemented in the next iteration. 
            Currently, the conversion matrix and simulation engine are fully operational.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <p>Product unit overrides (e.g. Sales Unit = Carton, Purchase Unit = Pallet) will be managed here once the master product list is populated.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
