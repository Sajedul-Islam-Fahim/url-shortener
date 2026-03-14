<?php

namespace App\Models;

use App\Models\Url;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Click extends Model
{
    use HasFactory;
    protected $fillable = [
        'url_id',
        'ip_address',
        'country',
        'browser',
        'os',
        'device',
        'referrer',
    ];

    public function url()
    {
        return $this->belongsTo(Url::class);
    }
}
