<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Info(
 *     title="Product API",
 *     version="1.0.0",
 *     description="API for managing products with country-based SKU"
 * )
 *
 * @OA\Schema(
 *     schema="Product",
 *     required={"name", "country"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Product Name"),
 *     @OA\Property(property="country", type="string", maxLength=2, example="MX"),
 *     @OA\Property(property="sku", type="string", readOnly=true, example="CT-MX-1"),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", readOnly=true),
 *     @OA\Property(property="deleted_at", type="string", format="date-time", nullable=true)
 * )
 *
 * @OA\Tag(
 *     name="Products",
 *     description="Operations about products"
 * )
 */
class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/products",
     *     tags={"Products"},
     *     summary="Get all products (including soft deleted)",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Product")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        $products = Product::withTrashed()->get();
        return response()->json($products);
    }

    /**
     * @OA\Post(
     *     path="/api/products",
     *     tags={"Products"},
     *     summary="Create a new product",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Product")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Product")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $existingProduct = Product::withTrashed()
            ->where('name', $request->name)
            ->where('country', $request->country)
            ->first();

        if ($existingProduct) {
            return response()->json(['message' => 'La información del producto ya existe. Intenta con información diferente.'], 409);
        }

        $product = Product::create($request->validated());
        return response()->json($product, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/products/{id}",
     *     tags={"Products"},
     *     summary="Get product by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Numeric ID of the product",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/Product")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function show($id): JsonResponse
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['message' => 'Ese ID no existe'], 404);
        }

        return response()->json($product);
    }

    /**
 * @OA\Put(
 *     path="/api/products/{id}",
 *     tags={"Products"},
 *     summary="Update product",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Numeric ID of the product to update",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(ref="#/components/schemas/Product")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product updated successfully",
 *         @OA\JsonContent(ref="#/components/schemas/Product")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Product not found"
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Duplicate product data"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 */
public function update(UpdateProductRequest $request, $id): JsonResponse
{
    $product = Product::withTrashed()->find($id);

    if (!$product) {
        return response()->json(['message' => 'Ese ID no existe'], 404);
    }

    if ($product->trashed()) {
        return response()->json(['message' => 'El producto está eliminado. Solo puede ser recuperado.'], 403);
    }

    $dataChanged = $request->name !== $product->name || $request->country !== $product->country;

    if ($dataChanged) {
        $existingProduct = Product::withTrashed()
            ->where('name', $request->name)
            ->where('country', $request->country)
            ->where('id', '!=', $id)
            ->first();

        if ($existingProduct) {
            $message = 'Ya existe un producto con el mismo nombre y país.';

            $details = [
                'existing_product_id' => $existingProduct->id,
                'conflict_fields' => [
                    'name' => $request->name,
                    'country' => $request->country
                ]
            ];

            return response()->json([
                'message' => $message,
                'details' => $details
            ], 409);
        }
    }

    $product->update($request->validated());
    return response()->json($product);
}

    /**
 * @OA\Delete(
 *     path="/api/products/{id}",
 *     tags={"Products"},
 *     summary="Soft delete a product",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Numeric ID of the product to delete",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Producto eliminado con éxito")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Product not found"
 *     )
 * )
 */
public function destroy($id): JsonResponse
{
    $product = Product::withTrashed()->find($id);

    if (!$product) {
        return response()->json(['message' => 'Ese ID no existe'], 404);
    }

    if ($product->trashed()) {
        return response()->json(['message' => 'El producto ya está eliminado.'], 403);
    }

    $product->delete();
    return response()->json(['message' => 'Producto eliminado con éxito'], 200);
}


    /**
     * @OA\Patch(
     *     path="/api/products/{id}/restore",
     *     tags={"Products"},
     *     summary="Restore a soft-deleted product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Numeric ID of the product to restore",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product restored successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Product restored")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function restore($id): JsonResponse
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['message' => 'Ese ID no existe'], 404);
        }

        $product->restore();
        return response()->json(['message' => 'Product restored']);
    }
}
