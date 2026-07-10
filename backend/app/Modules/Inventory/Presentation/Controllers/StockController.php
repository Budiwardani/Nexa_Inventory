<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Domain\Models\Stock;
use App\Modules\Inventory\Domain\Models\StockCard;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        return response()->json(
            Stock::with(['product', 'warehouse', 'location'])->paginate(50)
        );
    }

    public function ledger(Request $request)
    {
        $query = StockCard::with(['product', 'warehouse', 'reference'])->latest();
        
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        
        if ($request->has('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        return response()->json($query->paginate(50));
    }
}
