<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'country', 'sku'];
    protected $dates = ['deleted_at'];

    protected static function booted()
    {
        static::creating(function ($product) {
            $countryCode = strtoupper(substr($product->country, 0, 2));
            $product->sku = 'CT-'.$countryCode.'-'.(Product::withTrashed()->count() + 1);
        });

        static::updating(function ($product) {
            if ($product->isDirty('country')) {
                $countryCode = strtoupper(substr($product->country, 0, 2));
                $id = $product->id;
                $product->sku = 'CT-'.$countryCode.'-'.$id;
            }
        });
    }
}
