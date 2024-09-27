import { resend } from "@/lib/resend";
import { VerificationEmail} from '@/emails/verificationEmail'

import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message VerificationEmailerificationCode',
            react: VerificationEmail({username, verifyCode}),
          });
        return {success: true, message:"verification email send succesfully"}
    } catch (emailError) {
        console.error("error sending verification email", emailError)
        return {success: false, message:"failed to send verification email"}
        
    }
}