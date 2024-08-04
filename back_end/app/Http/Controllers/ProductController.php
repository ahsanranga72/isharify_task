<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::with('images')
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('category', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate(8);

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('uploads', 'public');
                $product->images()->create(['path' => $path]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            foreach ($product->images as $image) {
                Storage::delete('public/' . $image->path);
                $image->delete();
            }

            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                ]);
            }
        }

        return response()->json($product->load('images'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            foreach ($product->images as $image) {
                Storage::delete('public/' . $image->path);
                $image->delete();
            }

            $product->delete();

            return response()->json(['message' => 'Product successfully deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while deleting the product'], 500);
        }
    }
    /**
     * bulk upload csv file.
     */
    public function bulkUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));

        $header = array_shift($data);

        $expectedHeader = ['name', 'category', 'description'];
        if ($header !== $expectedHeader) {
            return response()->json(['message' => 'Invalid CSV header'], 422);
        }

        foreach ($data as $row) {
            $validator = Validator::make(array_combine($header, $row), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                continue;
            }

            $existingProduct = Product::where('name', $row[0])->first();
            if ($existingProduct) {
                continue;
            }

            $product = Product::create([
                'name' => $row[0],
                'category' => $row[1],
                'description' => $row[2],
            ]);
        }

        return response()->json(['message' => 'Bulk upload successful'], 200);
    }
}
