import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";
import { Client } from '@/backend/types/type';
import { NextResponse } from 'next/server';

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


// updating client 



export async function PUT(
  request: Request,
  
) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');
    const clientId = url.searchParams.get('clientId');
    
    const updatedClientData = await request.json();
    
    

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    const client = business.clients.id(clientId);
    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    Object.assign(client, updatedClientData);
    await business.save();

    return NextResponse.json(
      { message: 'Client updated successfully', data: { client: client } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { message: 'Error updating client' },
      { status: 500 }
    );
  }
}

//delete client

export async function DELETE(
  request: Request
) {
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');
    const clientId = url.searchParams.get('clientId');

    if (!businessId || !clientId) {
      return NextResponse.json(
        { message: 'Business ID and Client ID are required' },
        { status: 400 }
      );
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    const clientIndex = business.clients.findIndex(
      (client) => client._id.toString() === clientId
    );

    if (clientIndex === -1) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    business.clients.splice(clientIndex, 1);
    await business.save();

    return NextResponse.json(
      { message: 'Client deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { message: 'Error deleting client' },
      { status: 500 }
    );
  }
}


