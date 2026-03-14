<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Click;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $urls   = $request->user()->urls();
        $urlIds = $request->user()->urls()->pluck('id');

        $clicksToday = Click::whereIn('url_id', $urlIds)
            ->whereDate('created_at', today())
            ->count();

        $clicksThisMonth = Click::whereIn('url_id', $urlIds)
            ->whereMonth('created_at', now()->month)
            ->count();

        $topUrls = $request->user()->urls()
            ->orderByDesc('total_clicks')
            ->limit(5)
            ->get();

        return response()->json([
            'total_urls'        => (clone $urls)->count(),
            'active_urls'       => (clone $urls)->where('is_active', true)->count(),
            'inactive_urls'     => (clone $urls)->where('is_active', false)->count(),
            'total_clicks'      => (clone $urls)->sum('total_clicks'),
            'clicks_today'      => $clicksToday,
            'clicks_this_month' => $clicksThisMonth,
            'top_urls'          => $topUrls,
        ]);
    }
}
