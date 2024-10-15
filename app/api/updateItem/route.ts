import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";
import { Item } from '@/backend/types/type';


export async function PUT(request: Request) {
  await connectDB();

  try {
    const { businessId, itemId, name, price,tax } = await request.json();

    if (!businessId || !itemId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Business ID and item ID are required.',
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

    const itemIndex = business.items.findIndex((item: Item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Item not found.',
        }),
        { status: 404 }
      );
    }

    // Update item information
    if (name) business.items[itemIndex].name = name;
    if (price !== undefined) business.items[itemIndex].price = price;
    if (tax) business.items[itemIndex].tax = tax;

    await business.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Item updated successfully.',
        data: business.items[itemIndex],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating item:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error updating item',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}