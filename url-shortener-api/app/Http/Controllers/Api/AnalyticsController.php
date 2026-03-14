<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Url;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function index(Request $request, Url $url)
    {
        $this->authorize('view', $url);

        $clicks = $url->clicks();

        $clicksByDate = (clone $clicks)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byBrowser = (clone $clicks)
            ->selectRaw('browser, COUNT(*) as count')
            ->groupBy('browser')
            ->orderByDesc('count')
            ->get();

        $byOs = (clone $clicks)
            ->selectRaw('os, COUNT(*) as count')
            ->groupBy('os')
            ->orderByDesc('count')
            ->get();

        $byDevice = (clone $clicks)
            ->selectRaw('device, COUNT(*) as count')
            ->groupBy('device')
            ->orderByDesc('count')
            ->get();

        $byReferrer = (clone $clicks)
            ->selectRaw('referrer, COUNT(*) as count')
            ->whereNotNull('referrer')
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        $byCountry = (clone $clicks)
            ->selectRaw('country, COUNT(*) as count')
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('count')
            ->get();

        return response()->json([
            'url'          => $url,
            'total_clicks' => $url->total_clicks,
            'clicks_by_date' => $clicksByDate,
            'by_browser'   => $byBrowser,
            'by_os'        => $byOs,
            'by_device'    => $byDevice,
            'by_referrer'  => $byReferrer,
            'by_country'   => $byCountry,
        ]);
    }
}
