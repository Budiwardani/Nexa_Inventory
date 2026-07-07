<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Core\Domain\Models\Setting;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = Setting::orderBy('group')->orderBy('key')->get();
        return response()->json(['success' => true, 'data' => $rows]);
    }

    public function store(Request $request): JsonResponse
    {
        $v = $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        $setting = Setting::create(array_merge($v, ['group' => $v['group'] ?? 'general']));

        return response()->json([
            'success' => true, 
            'message' => 'Setting created', 
            'data' => $setting
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $setting = Setting::findOrFail($id);
        
        $v = $request->validate([
            'key' => 'required|string|unique:settings,key,' . $setting->id,
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        $setting->update($v);

        return response()->json([
            'success' => true, 
            'message' => 'Setting updated', 
            'data' => $setting
        ]);
    }
    
    public function destroy(int $id): JsonResponse
    {
        Setting::destroy($id);
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }
}
