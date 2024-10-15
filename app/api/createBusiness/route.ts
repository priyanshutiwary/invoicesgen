import connectDB from '@/backend/db/index.js';
import { Business } from "@/backend/model/user";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { userId, name, email, address, description, gstNumber } = await request.json();
    // Check if a business with the same GST number already exists
    let existingBusiness = await Business.findOne({
        user: userId,
        $or: [
          { gst_number: gstNumber },
          { name: name }
        ]
      });    
     
    if (existingBusiness) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Business already exist with this Name or GST-IN',
          data: existingBusiness,
        }),
        { status: 200 }
      );
    } else {
      
      const newBusiness = new Business({
        user: userId,
        name: name,
        contact: email,
        address: address,
        description: description,
        gst_number: gstNumber,
      });

      await newBusiness.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Business created successfully',
          data: newBusiness,
        }),
        { status: 201 } 
      );
    }
  } catch (error) {
    console.error('Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating business',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
