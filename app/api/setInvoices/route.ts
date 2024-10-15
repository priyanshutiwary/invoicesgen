import connectDB from '@/backend/db/index.js';
import { Business, Invoice,Activity } from "@/backend/model/user";
import { InvoiceItem } from '@/backend/types/type';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { 
      businessId, 
      clientId, 
      items, 
      total, 
      paymentStatus, 
      dueDate, 
      billDate, 
      isItemwiseTax, 
      totalTaxRate 
    } = await request.json();
    
    console.log('Incoming Invoice Data:', { 
      businessId, 
      clientId, 
      items, 
      total, 
      paymentStatus, 
      dueDate, 
      billDate, 
      isItemwiseTax, 
      totalTaxRate 
    });

    if (!businessId || !clientId || !items || !total || !paymentStatus || !billDate || isItemwiseTax === undefined) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields for invoice creation.',
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

    const clientExists = business.clients.some(client => client._id.toString() === clientId);
    if (!clientExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Client not found for this business.',
        }),
        { status: 404 }
      );
    }

    for (const item of items) {
      const itemExists = business.items.some(businessItem => businessItem._id.toString() === item._id);
      if (!itemExists) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Item with ID ${item._id} not found in business inventory.`,
          }),
          { status: 400 }
        );
      }
    }

    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    const lastInvoiceNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-')[1]) : 0;
    const newInvoiceNumber = `INV-${(lastInvoiceNumber + 1).toString().padStart(6, '0')}`;

    const newInvoice = new Invoice({
      business: businessId,
      client: clientId,
      invoice_number: newInvoiceNumber,
      items: items.map((item: InvoiceItem) => ({
        item: item._id,
        quantity: item.quantity,
        price: item.price,
        tax: item.tax
      })),
      total_amount: total,
      status: paymentStatus === 'paid' ? 'paid' : 'pending',
      paymentStatus,
      dueDate: dueDate ,
      billDate: billDate,
      isItemwiseTax,
      totalTaxRate
    });

    console.log('Invoice Before Save:', newInvoice);
    
    
    
    await newInvoice.save();
    const newActivity = new Activity({
        business: businessId,
        activity_type: 'invoice_generated',
        description: `Invoice ${newInvoiceNumber} generated`,
        amount: total,
        timestamp: new Date()
      });

      await newActivity.save();

      business.activities.push(newActivity._id);

    await business.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invoice created successfully.',
        data: newInvoice,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating invoice:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating invoice',
        error: error.message,
      }),
      { status: 500 }
    );
  }

  
}
// for retreiving business invoice 


export async function GET(request: Request) {
  await connectDB();

  try {
    // Extract businessId from query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    // Validate if businessId is provided
    if (!businessId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required businessId parameter.',
        }),
        { status: 400 }
      );
    }

    // Verify if the business exists
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

    // Fetch all invoices related to this business
    const invoices = await Invoice.find({ business: businessId })
    //   .populate({
    //     path: 'client', // Populate the client details
    //     select: 'name contact', // Select client details to display
    //   })
    //   .populate({
    //     path: 'items.item', // Populate item details
    //     select: 'name price tax', // Select item details to display
    //   });

    // If no invoices are found, return a message
    if (invoices.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No invoices found for this business.',
        }),
        { status: 404 }
      );
    }

    // Return the fetched invoices data
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invoices fetched successfully.',
        data: invoices,
      }),
      { status: 200 }
    );
    
    
  } catch (error) {
    console.error('Error fetching invoices:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching invoices',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
