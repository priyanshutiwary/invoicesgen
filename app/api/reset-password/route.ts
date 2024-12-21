import connectDB from '@/backend/db/index.js'
import { User } from "@/backend/model/user"
import crypto from 'crypto' 
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  await connectDB();

  try {
    const { token, password } = await request.json();
    console.log(token);
    console.log(password);
    
    const hashedInputToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    console.log(hashedInputToken);
    
    const user = await User.findOne({verifyCode: hashedInputToken });
    console.log(user);
    
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found with this email/mobile number',
        },
        { status: 404 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return Response.json(
        {
          success: true,
          message: 'Password reset succesful',
          status: 201
        },
        { status: 200 }
      );

    
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return Response.json(
      {
        success: false,
        message: 'Error requesting password reset',
      },
      { status: 500 }
    );
  }
}