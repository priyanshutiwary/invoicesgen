import connectDB from '@/backend/db/index.js'
import bcrypt from "bcryptjs"
import {User} from "@/backend/model/user"
import { sendVerificationEmail } from '@/backend/helpers/sendVerificationEmail'


export async function POST(request: Request) {
    await connectDB();
  
    try {
      const { username, contact, password } = await request.json();
  
      const existingVerifiedUserByUsername = await User.findOne({
        username,
        isVerified: true,
      });
  
      if (existingVerifiedUserByUsername) {
        return Response.json(
          {
            success: false,
            message: 'Username is already taken',
          },
          { status: 400 }
        );
      }
  
      const existingUserBycontact = await User.findOne({ contact });
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      if (existingUserBycontact) {
        if (existingUserBycontact.isVerified) {
          return Response.json(
            {
              success: false,
              message: 'User already exists with this email/mobile number',
            },
            { status: 400 }
          );
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUserBycontact.password = hashedPassword;
          existingUserBycontact.verifyCode = verifyCode;
          existingUserBycontact.verifyCodeExpiry = new Date(Date.now() + 3600000);
          await existingUserBycontact.save();
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
  
        const newUser = new User({
            username,
            contact: contact ,
            password: hashedPassword,
            created_at: new Date(),
            last_login: null,
            verifyCode: verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified: false,
        });
  
        await newUser.save();
      }
  
      // Send verification email
      const emailResponse = await sendVerificationEmail(
        username,
        contact,
        verifyCode
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
          message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error registering user:', error);
      return Response.json(
        {
          success: false,
          message: 'Error registering user',
        },
        { status: 500 }
      );
    }
  }