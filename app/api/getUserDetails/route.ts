import connectDB from "@/backend/db";
import { User } from "@/backend/model/user";
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    
    await connectDB();

    try {
        // Exclude the password and verifyCode fields
        const user = await User.findById(user_id).select("-password -verifyCode");
        
        
        return Response.json({
            success: true,
            message: 'User detail fetched',
            userDetail: user,
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error getting userDetail", error);
        return Response.json(
            {
                success: false,
                message: "Error getting userDetail",
            },
            { status: 500 }
        );
    }
}
