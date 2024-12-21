import connectDB from "@/backend/db";
import { User } from "@/backend/model/user"
import { z } from "zod"
import { usernameValidation } from "@/backend/schemas/signUpSchema";

// Mark route as dynamic
export const dynamic = 'force-dynamic'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connectDB()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("Username validation result:", result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid query parameter',
            }, { status: 400 })
        }

        const { username } = result.data
        const existingVerifiedUser = await User.findOne({ 
            username, 
            isVerified: true 
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: 'Username is unique'
        }, { status: 200 }) // Changed to 200 as it's a successful GET request
    } catch (error) {
        console.error("Error checking username:", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}