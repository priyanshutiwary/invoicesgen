import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";
import { Client } from '@/backend/types/type';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { businessId, name, contact, gstNumber: gst_number } = await request.json();

    if (!businessId || !name || !contact) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Business ID, client name, and contact are required.',
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

    // Check if the client name or GST number already exists within the same business
    const clientExists = business.clients.some((client: Client) => client.name === name);
    const gstExists = gst_number && business.clients.some((client: Client) => client.gst_number === gst_number);

    if (clientExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'A client with this name already exists in this business.',
        }),
        { status: 400 }
      );
    }

    if (gstExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'A client with this GST number already exists in this business.',
        }),
        { status: 400 }
      );
    }

    // Incremental logic: Find the highest clientNumber and increment it
    const highestClientNumber = business.clients.length > 0
      ? Math.max(...business.clients.map((client: Client) => client.clientNumber))
      : 0;
    const newClientNumber = highestClientNumber + 1;

    const newClient = {
      clientNumber: newClientNumber,
      name,
      contact,
      gst_number,
    };

    // Add the new client to the business
    business.clients.push(newClient);
    await business.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Client added successfully.',
        data: newClient,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding client:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error adding client',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
