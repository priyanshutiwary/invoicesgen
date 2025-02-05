import connectDB from '@/backend/db/index.js';
import { Business, Invoice,Activity } from "@/backend/model/user";
import { InvoiceItem, Client } from '@/backend/types/type';

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
      totalTaxRate,
      invoice_id,
      client
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
      totalTaxRate,
      invoice_id,
      client
      
    });
//!clientId || 
    if (!businessId || !items || !total || !paymentStatus || !billDate || isItemwiseTax === undefined) {
      
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields for invoice creation.',
        }),
        { status: 400 }
      );
    }
    console.log("reached");
    
    

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

    // const clientExists = business.clients.some(client => client._id.toString() === clientId);
    // if (!clientExists) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: 'Client not found for this business.',
    //     }),
    //     { status: 404 }
    //   );
    // }

    // for (const item of items) {
    //   const itemExists = business.items.some(businessItem => businessItem._id.toString() === item._id);
    //   if (!itemExists) {
    //     return new Response(
    //       JSON.stringify({
    //         success: false,
    //         message: `Item with ID ${item._id} not found in business inventory.`,
    //       }),
    //       { status: 400 }
    //     );
    //   }
    // }

    // Find the last invoice for this specific business
    const lastInvoice = await Invoice.findOne({ business: businessId }).sort({ createdAt: -1 });
    const lastInvoiceNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-')[1]) : 0;
    const newInvoiceNumber = `INV-${(lastInvoiceNumber + 1).toString().padStart(6, '0')}`;

    const newInvoice = new Invoice({
      business: businessId,
      
      invoice_id: invoice_id,
      invoice_number: newInvoiceNumber,
      items: items.map((item: InvoiceItem) => ({
        item: String(item._id).startsWith('temp-') ? undefined : item._id,
        name: item.name,
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
      totalTaxRate,
      total:total,
      client: {
        ...(client._id.startsWith('new-') ? {} : { clientId: clientId }),
        name: client.name,
        contact: client.contact,
        gst_number: client.gst_number
      },
      
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
    console.log(invoices);
    
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


export async function PATCH(request: Request) {
    await connectDB();
  
    try {
      const { invoiceId, action, newDueDate } = await request.json();
      console.log(invoiceId,action,newDueDate);
      
      // Validate that invoiceId and action are provided
      if (!invoiceId || !action) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Missing required fields: invoiceId or action.',
          }),
          { status: 400 }
        );
      }
  
      // Find the invoice
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invoice not found.',
          }),
          { status: 404 }
        );
      }
  
      // Common function to log activities
      const logActivity = async (activityType, description) => {
        const activity = new Activity({
          business: invoice.business,
          activity_type: activityType,
          description,
          timestamp: new Date(),
        });
        await activity.save();
      };
  
      // Perform actions based on the provided action
      switch (action) {
        case 'extendDueDate':
          if (!newDueDate) {
            return new Response(
              JSON.stringify({
                success: false,
                message: 'Missing newDueDate for extending due date.',
              }),
              { status: 400 }
            );
          }
  
          // Update the due date
          invoice.dueDate = newDueDate;
          invoice.paymentStatus="duedate"
          await invoice.save();
  
          // Log the activity
          await logActivity(
            'invoice_due_date_extended',
            `Due date for invoice #${invoice.invoice_number} extended to ${new Date(newDueDate).toLocaleDateString()}.`
          );
  
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Due date extended successfully.',
              invoice,
            }),
            { status: 200 }
          );
  
        case 'markAsPaid':
          // Mark the invoice as paid
          invoice.status = 'paid';
          invoice.paymentStatus = 'paid'; // Set paymentStatus to 'paid'
          await invoice.save();
  
          // Log the activity
          await logActivity(
            'invoice_marked_paid',
            `Invoice #${invoice.invoice_number} marked as paid.`
          );
  
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Invoice marked as paid successfully.',
              invoice,
            }),
            { status: 200 }
          );
  
        default:
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Invalid action.',
            }),
            { status: 400 }
          );
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
  
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error updating invoice',
          error: error.message,
        }),
        { status: 500 }
      );
    }
  }
  
