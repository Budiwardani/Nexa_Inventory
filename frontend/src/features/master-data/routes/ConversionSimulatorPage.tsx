import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Calculator } from 'lucide-react';
import { useGetUnits, useSimulateConversion } from '../api/unitConversionHooks';

export function ConversionSimulatorPage() {
  const { data: unitsData } = useGetUnits();
  const units = unitsData?.success ? unitsData.data : [];

  const simulateMutation = useSimulateConversion();

  const [form, setForm] = useState({ source_unit_id: '', target_unit_id: '', quantity: 1 });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = () => {
    setError(null);
    setResult(null);

    if (!form.source_unit_id || !form.target_unit_id || !form.quantity) {
      setError('Please fill in all fields');
      return;
    }

    simulateMutation.mutate(
      {
        source_unit_id: parseInt(form.source_unit_id),
        target_unit_id: parseInt(form.target_unit_id),
        quantity: Number(form.quantity)
      },
      {
        onSuccess: (data: any) => {
          if (data.success) {
            setResult(data.data.result_quantity);
          } else {
            setError(data.message || 'Conversion failed');
          }
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || err.message || 'An error occurred during conversion');
        }
      }
    );
  };

  const sourceUnit = units.find((u: any) => u.id === parseInt(form.source_unit_id));
  const targetUnit = units.find((u: any) => u.id === parseInt(form.target_unit_id));

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversion Simulator</h1>
        <p className="text-muted-foreground mt-1">Test your conversion rules to ensure accuracy.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Test Conversion
          </CardTitle>
          <CardDescription>Select source unit, target unit, and quantity to calculate the expected output based on active rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Source Quantity</Label>
              <Input type="number" min="0" step="any" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            
            <div className="space-y-2 flex-1">
              <Label>Source Unit</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.source_unit_id} onChange={e => setForm({ ...form, source_unit_id: e.target.value })}>
                <option value="">Select Unit...</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.unit_name} ({u.unit_code})</option>)}
              </select>
            </div>

            <div className="pb-2 text-muted-foreground hidden md:block">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="space-y-2 flex-1">
              <Label>Target Unit</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.target_unit_id} onChange={e => setForm({ ...form, target_unit_id: e.target.value })}>
                <option value="">Select Target...</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.unit_name} ({u.unit_code})</option>)}
              </select>
            </div>

            <Button onClick={handleSimulate} disabled={simulateMutation.isPending} className="w-full md:w-auto h-10">
              {simulateMutation.isPending ? 'Calculating...' : 'Simulate'}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
              <strong>Error: </strong> {error}
            </div>
          )}

          {result !== null && !error && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center mt-6">
              <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wider mb-2">Conversion Result</p>
              <div className="flex justify-center items-baseline gap-3 text-emerald-900">
                <span className="text-3xl font-bold">{form.quantity}</span>
                <span className="text-lg font-mono text-emerald-600">{sourceUnit?.unit_code}</span>
                <span className="text-2xl text-emerald-400 mx-2">=</span>
                <span className="text-4xl font-extrabold">{result}</span>
                <span className="text-xl font-mono text-emerald-600">{targetUnit?.unit_code}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
