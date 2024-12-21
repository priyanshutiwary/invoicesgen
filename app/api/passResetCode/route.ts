// import connectDB from '@/backend/db/index.js'
// import { User } from "@/backend/model/user"
// import { sendResetPasswordCode } from '@/backend/helpers/sendResetPasswordCode' // New helper function


// export async function POST(request: Request) {
//   await connectDB();

//   try {
//     const { contact } = await request.json();
//     console.log(contact);
    
//     const user = await User.findOne({ contact });
//     if (!user) {
//       return Response.json(
//         {
//           success: false,
//           message: 'User not found with this email/mobile number',
//         },
//         { status: 404 }
//       );
//     }

//     // Generate a password reset token
//     const resetToken =Math.floor(10000000 + Math.random() * 90000000).toString();
//     const expiryDate = new Date();
//     expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour

//     user.verifyCode = resetToken;
//     user.verifyCodeExpiry = expiryDate;

//     await user.save();

//     // Send password reset email
//     const emailResponse = await sendResetPasswordCode(
//       user.name,
//       user.contact,
//       resetToken
//     );
    
    
//     if (!emailResponse.success) {
//       return Response.json(
//         {
//           success: false,
//           message: emailResponse.message,
//         },
//         { status: 500 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: 'Password reset instructions sent to your email/mobile number.',
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error requesting password reset:', error);
//     return Response.json(
//       {
//         success: false,
//         message: 'Error requesting password reset',
//       },
//       { status: 500 }
//     );
//   }
// }

import connectDB from '@/backend/db/index.js'
import { User } from "@/backend/model/user"
import { sendResetPasswordCode } from '@/backend/helpers/sendResetPasswordCode' // Updated helper
import crypto from 'crypto' // For generating secure tokens

export async function POST(request: Request) {
  await connectDB();

  try {
    const { email } = await request.json();
    const contact = email;
    const user = await User.findOne({ contact });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found with this email/mobile number',
        },
        { status: 404 }
      );
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour

    // Store the hashed version of the token in the database for security
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // user.resetToken = hashedToken;
    // user.resetTokenExpiry = expiryDate;
    
    // Remove old verify code fields if they exist
    user.verifyCode = hashedToken;
    user.verifyCodeExpiry = expiryDate;

    await user.save();

    // Create the reset password URL
    // Note: Replace YOUR_FRONTEND_URL with your actual frontend URL
    const resetUrl = `${process.env.PASSWORD_RESET_FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send password reset email with the link
    const emailResponse = await sendResetPasswordCode(
      user.name,
      user.contact,
      resetUrl
    );
    
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Password reset link has been sent to your email/mobile number.',
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