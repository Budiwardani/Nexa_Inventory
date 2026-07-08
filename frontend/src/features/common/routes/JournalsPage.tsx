import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { useGetJournals, useGetJournalDetails } from '../api/accountingHooks';

export function JournalsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetJournals(page);
  const journals = data?.data || [];
  const meta = data?.meta;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: detailData, isLoading: detailLoading } = useGetJournalDetails(selectedId || 0);

  const handleNextPage = () => {
    if (meta && page < meta.last_page) setPage(p => p + 1);
  };
  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  if (isLoading && page === 1) return <div className="p-8">Loading Journals...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
        <p className="text-muted-foreground mt-1">View system-generated accounting journals.</p>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Journal #</th>
              <th className="px-4 py-3 text-left">Ref Type</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {journals.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No journals found.</td></tr>
            ) : (
              journals.map((j: any) => (
                <tr key={j.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap">{j.journal_date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{j.journal_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {j.reference_type ? `${j.reference_type} #${j.reference_id}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{j.description || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium">{Number(j.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedId(j.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {meta && meta.last_page > 1 && (
          <div className="p-4 border-t flex justify-between items-center bg-muted/20">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>Previous</Button>
            <span className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === meta.last_page}>Next</Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Journal Details: {detailData?.data?.journal_number}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {detailLoading ? (
              <p className="text-center text-muted-foreground">Loading details...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                  <div><span className="text-muted-foreground block text-xs uppercase">Date</span> {detailData?.data?.journal_date}</div>
                  <div><span className="text-muted-foreground block text-xs uppercase">Reference</span> {detailData?.data?.reference_type} #{detailData?.data?.reference_id}</div>
                  <div className="col-span-2"><span className="text-muted-foreground block text-xs uppercase">Description</span> {detailData?.data?.description}</div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Account</th>
                        <th className="px-3 py-2 text-left">Type</th>
                        <th className="px-3 py-2 text-right">Debit</th>
                        <th className="px-3 py-2 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData?.data?.details?.map((d: any) => (
                        <tr key={d.id} className="border-b last:border-0">
                          <td className="px-3 py-2 font-mono text-xs">{d.chart_of_account?.account_code} - {d.chart_of_account?.account_name}</td>
                          <td className="px-3 py-2 text-muted-foreground">{d.chart_of_account?.account_type}</td>
                          <td className="px-3 py-2 text-right">{Number(d.debit) > 0 ? Number(d.debit).toLocaleString() : ''}</td>
                          <td className="px-3 py-2 text-right">{Number(d.credit) > 0 ? Number(d.credit).toLocaleString() : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/20 font-semibold border-t">
                      <tr>
                        <td colSpan={2} className="px-3 py-2 text-right text-muted-foreground uppercase text-xs">Total</td>
                        <td className="px-3 py-2 text-right">{Number(detailData?.data?.total_amount).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{Number(detailData?.data?.total_amount).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
