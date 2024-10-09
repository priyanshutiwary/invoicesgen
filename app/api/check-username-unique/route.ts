import connectDB from "@/backend/db";
import {User} from "@/backend/model/user"
import {z} from "zod"
import { usernameValidation } from "@/backend/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    

    
    await connectDB()

    try {
        const {searchParams} =new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if (!result.success){
            const usernameErrors = result.error.format().
            username?.errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Inavalid query parameter',
                
            }, {status:400})
        }

        const {username} = result.data
        const existingVerifiedUser = await User.findOne
        ({username, isVerified: true})
        if (existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'username is already taken'
                
                
            }, {status:400})
        }
        return Response.json({
            success: true,
            message: 'username is unique'
            
        }, {status:201})
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
        {
            success:false,
            message: "error checking username"
        },
        {status : 500}
    )

    }
    
}
