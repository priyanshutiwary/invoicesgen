import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";
import { Item } from '@/backend/types/type';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { businessId, name, description, price, tax } = await request.json();
    
    if (!businessId || !name || !price || tax === undefined) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Business ID, item name, price, and tax are required.',
        }),
        { status: 400 }
      );
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Business not found.',
        }),
        { status: 404 }
      );
    }

    // Check if the item name already exists within the same business
    const itemExists = business.items.some((item: Item) => item.name === name);

    if (itemExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'An item with this name already exists in this business.',
        }),
        { status: 400 }
      );
    }

    // Incremental logic: Find the highest itemNumber and increment it
    const highestItemNumber = business.items.length > 0
      ? Math.max(...business.items.map((item: Item) => item.itemNumber))
      : 0;
    const newItemNumber = highestItemNumber + 1;

    // Create the new item object
    const newItem = {
      itemNumber: newItemNumber,
      name,
      description,
      price: Number(price),
      tax: Number(tax),
    };

    // Add the new item to the business
    business.items.push(newItem);

    // Save the updated business document
    await business.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Item added successfully.',
        data: newItem,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error adding item',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
