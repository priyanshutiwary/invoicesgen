import { NextResponse } from 'next/server';
import { Business } from '@/backend/model/user'; // Adjust the import path as needed


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