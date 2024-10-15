import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";
import { Item } from '@/backend/types/type';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { businessId, name, price, tax } = await request.json();
    
    // Log incoming data for debugging
    console.log('Incoming Data:', { businessId, name, price, tax });

    // Validate required fields
    if (!businessId || !name || !price || tax === undefined) { // Ensure tax is included
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

    // Check for unique item name
    const existingItem = business.items.find(item => item.name === name);
    if (existingItem) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'An item with this name already exists.',
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
      price,
      tax,
    };

    // Push the new item to the business's items array
    business.items.push(newItem);

    // Log business before saving
    console.log('Business Before Save:', business);

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
