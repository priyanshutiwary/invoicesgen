import connectDB from "@/backend/db";
import { Business, Activity, Invoice } from "@/backend/model/user";
import { NextRequest } from 'next/server'; // Import NextRequest
import mongoose from 'mongoose';
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

//deleting business

// export async function DELETE(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const business_id = searchParams.get('business_id'); // Get business_id from query parameters
//     console.log(business_id);
    
//     await connectDB();

//     try {
//         const deletedBusiness = await Business.findByIdAndDelete(business_id); // Delete by business_id

//         if (!deletedBusiness) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: 'Business not found',
//                 },
//                 { status: 404 }
//             );
//         }

//         return Response.json(
//             {
//                 success: true,
//                 message: 'Business deleted successfully',
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error deleting business", error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error deleting business",
//             },
//             { status: 500 }
//         );
//     }
// }

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const business_id = searchParams.get('business_id');
    
    if (!business_id) {
        return Response.json(
            {
                success: false,
                message: 'Business ID is required',
            },
            { status: 400 }
        );
    }

    await connectDB();

    try {
        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Delete the business
            const deletedBusiness = await Business.findByIdAndDelete(business_id).session(session);

            if (!deletedBusiness) {
                await session.abortTransaction();
                return Response.json(
                    {
                        success: false,
                        message: 'Business not found',
                    },
                    { status: 404 }
                );
            }

            // Delete related activities
            await Activity.deleteMany({ business: business_id }).session(session);

            // Delete related invoices
            await Invoice.deleteMany({ business: business_id }).session(session);

            // Commit the transaction
            await session.commitTransaction();

            return Response.json(
                {
                    success: true,
                    message: 'Business and all related data deleted successfully',
                },
                { status: 200 }
            );
        } catch (error) {
            // If any error occurs, abort the transaction
            await session.abortTransaction();
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    } catch (error) {
        console.error("Error deleting business", error);
        return Response.json(
            {
                success: false,
                message: "Error deleting business and related data",
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}