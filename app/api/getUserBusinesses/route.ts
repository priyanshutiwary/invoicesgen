import connectDB from "@/backend/db";
import { Business } from "@/backend/model/user";
import { NextRequest } from 'next/server'; // Import NextRequest

export async function GET(req: NextRequest) { // Change to named export and accept req
    const { searchParams } = new URL(req.url); // Extract search parameters
    const user_id = searchParams.get('user_id'); // Get user_id from query parameters

    await connectDB();

    try {
        
        const businesses = await Business.find({ user: user_id });
        
         // Use user_id
        return Response.json({
            success: true,
            message: 'business detail fetched',
            businesses: businesses,
        }, { status: 201 });
        
        
    } catch (error) {
        console.error("Error getting business", error);
        return Response.json(
            {
                success: false,
                message: "error getting businesses"
            },
            { status: 500 }
        );
    }
}
