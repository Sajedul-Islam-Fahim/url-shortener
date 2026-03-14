<?php

namespace App\Http\Controllers;

use App\Models\Click;
use App\Models\Url;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function redirect(Request $request, string $code)
    {
        $url = Url::where('short_code', $code)->first();

        if (!$url || !$url->is_active || $url->isExpired()) {
            return response()->json(['message' => 'URL not found or expired'], 404);
        }

        // Parse user agent
        $userAgent = $request->userAgent() ?? '';
        $browser   = $this->getBrowser($userAgent);
        $os        = $this->getOs($userAgent);
        $device    = $this->getDevice($userAgent);

        // Track click
        Click::create([
            'url_id'     => $url->id,
            'ip_address' => $request->ip(),
            'browser'    => $browser,
            'os'         => $os,
            'device'     => $device,
            'referrer'   => $request->header('referer'),
            'country'    => null, // can integrate IP geolocation API later
        ]);

        // Increment total clicks
        $url->increment('total_clicks');

        return redirect()->away($url->original_url);
    }

    private function getBrowser(string $ua): string
    {
        if (str_contains($ua, 'Chrome'))  return 'Chrome';
        if (str_contains($ua, 'Firefox')) return 'Firefox';
        if (str_contains($ua, 'Safari'))  return 'Safari';
        if (str_contains($ua, 'Edge'))    return 'Edge';
        if (str_contains($ua, 'Opera'))   return 'Opera';
        return 'Other';
    }

    private function getOs(string $ua): string
    {
        if (str_contains($ua, 'Windows')) return 'Windows';
        if (str_contains($ua, 'Mac'))     return 'MacOS';
        if (str_contains($ua, 'Linux'))   return 'Linux';
        if (str_contains($ua, 'Android')) return 'Android';
        if (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) return 'iOS';
        return 'Other';
    }

    private function getDevice(string $ua): string
    {
        if (str_contains($ua, 'Mobile') || str_contains($ua, 'Android') || str_contains($ua, 'iPhone')) {
            return 'Mobile';
        }
        if (str_contains($ua, 'iPad') || str_contains($ua, 'Tablet')) {
            return 'Tablet';
        }
        return 'Desktop';
    }
}
