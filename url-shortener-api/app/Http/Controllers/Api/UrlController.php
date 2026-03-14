<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UrlController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->urls();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('original_url', 'like', "%{$request->search}%")
                  ->orWhere('short_code', 'like', "%{$request->search}%")
                  ->orWhere('title', 'like', "%{$request->search}%");
            });
        }

        if ($request->is_active !== null) {
            $query->where('is_active', $request->is_active === 'true');
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'original_url' => 'required|url|max:2048',
            'short_code'   => 'nullable|string|max:20|unique:urls,short_code|alpha_dash',
            'title'        => 'nullable|string|max:255',
            'expires_at'   => 'nullable|date|after:now',
            'is_active'    => 'boolean',
        ]);

        $data['user_id']    = $request->user()->id;
        $data['short_code'] = $data['short_code'] ?? $this->generateUniqueCode();
        $data['is_active']  = $data['is_active'] ?? true;

        $url = Url::create($data);

        return response()->json($url, 201);
    }

    public function show(Url $url)
    {
        $this->authorize('view', $url);
        return response()->json($url);
    }

    public function update(Request $request, Url $url)
    {
        $this->authorize('update', $url);

        $data = $request->validate([
            'original_url' => 'sometimes|required|url|max:2048',
            'short_code'   => 'sometimes|required|string|max:20|alpha_dash|unique:urls,short_code,' . $url->id,
            'title'        => 'nullable|string|max:255',
            'expires_at'   => 'nullable|date',
            'is_active'    => 'boolean',
        ]);

        $url->update($data);

        return response()->json($url);
    }

    public function destroy(Url $url)
    {
        $this->authorize('delete', $url);
        $url->clicks()->delete();
        $url->delete();

        return response()->json(['message' => 'URL deleted successfully']);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = Str::random(6);
        } while (Url::where('short_code', $code)->exists());

        return $code;
    }
}
