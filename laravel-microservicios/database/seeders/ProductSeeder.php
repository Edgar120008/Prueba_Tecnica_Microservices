<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Producto México',
            'country' => 'MX',
        ]);

        Product::create([
            'name' => 'Producto USA',
            'country' => 'US',
        ]);

        Product::create([
            'name' => 'Producto Canadá',
            'country' => 'CA',
        ]);
    }
}
