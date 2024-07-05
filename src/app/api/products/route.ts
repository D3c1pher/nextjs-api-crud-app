import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { ensureFileExists, readFile, writeFile } from '@/utils/data';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/models/product';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
ensureFileExists(productsFilePath);

// VIEW ALL PRODUCTS
export async function GET() {
  try {
    // Attempt to read product data from file
    const products: Product[] = readFile(productsFilePath);

    // Check if products array is empty
    if (products.length === 0) {
      return NextResponse.json({ message: 'No products available at this time', products }, { status: 200 });
    }

    return NextResponse.json({ message: 'GET products operation succeeded', products }, { status: 200 });
  } catch (error) {
    console.error('GET products operation failed:', error);
    return NextResponse.json({ message: 'GET products operation failed', error }, { status: 500 });
  }
}

// ADD NEW PRODUCT
export async function POST(req: NextRequest) {
  try {
    // Parse request body as Product
    const newProduct: Product = await req.json();

    // Check for missing required fields (modify based on your Product model)
    const requiredFields = ['name', 'description', 'price'];
    const missingFields = requiredFields.filter((field) => !(field in newProduct));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if id is already provided (optional, for validation)
    if (newProduct.id) {
      console.warn('New product already has an id. Overwriting with generated UUID.');
    }

    // Generate and assign UUID to id field
    newProduct.id = uuidv4();

    // Read existing products from file
    const existingProducts: Product[] = readFile(productsFilePath);

    // Add new product to the list
    existingProducts.push(newProduct);

    // Write updated product list to file
    writeFile(productsFilePath, existingProducts);

    return NextResponse.json({ message: 'POST product operation succeeded', newProduct }, { status: 201 });
  } catch (error) {
    console.error('POST product operation failed:', error);
    return NextResponse.json({ message: 'POST product operation failed', error }, { status: 500 });
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const updatedProduct: Product = await req.json();
//     let existingProducts: Product[] = readFile(productsFilePath);
//     existingProducts = existingProducts.map((product) =>
//       product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
//     );
//     writeFile(productsFilePath, existingProducts);
//     return NextResponse.json({ message: 'PUT product operation succeeded', updatedProduct }, { status: 200 });
//   } catch (error) {
//     console.error('PUT product operation failed:', error);
//     return NextResponse.json({ message: 'PUT product operation failed', error }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();
//     let existingProducts: Product[] = readFile(productsFilePath);
//     existingProducts = existingProducts.filter((product) => product.id !== id);
//     writeFile(productsFilePath, existingProducts);
//     return NextResponse.json({ message: 'DELETE product operation succeeded', deletedProductId: id }, { status: 200 });
//   } catch (error) {
//     console.error('DELETE product operation failed:', error);
//     return NextResponse.json({ message: 'DELETE product operation failed', error }, { status: 500 });
//   }
// }
