import connectDB from "@/backend/db";
import { Business } from "@/backend/model/user";
import { NextRequest } from 'next/server'; // Import NextRequest

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('business_id'); 

    // Ensure businessId is provided
    if (!businessId) {
        return Response.json({
            success: false,
            message: 'Business ID is required.',
        }, { status: 400 });
    }

    await connectDB();

    try {
        const businesses = await Business.find({ _id: businessId });

        if (businesses.length === 0) {
            return Response.json({
                success: false,
                message: 'No business found with the provided ID.',
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: 'Business details fetched successfully.',
            businesses: businesses,
        }, { status: 200 }); // Change status to 200 OK
        
    } catch (error) {
        console.error("Error getting business", error);
        return Response.json(
            {
                success: false,
                message: "Error getting businesses",
                error: error.message, // Optionally include the error message for debugging
            },
            { status: 500 }
        );
    }
}
