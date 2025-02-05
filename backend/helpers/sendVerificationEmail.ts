import { resend } from "@/backend/lib/resend";
import VerificationEmail from '@/emails/verificationEmail'

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any; // Make data optional
}

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'InvoiceGen <Verification@invoicesgen.com>',
            to: email,
            subject: 'Verify your email for InvoiceGen',
            react: VerificationEmail({username, otp: verifyCode}),
            
        })
        return {success: true, message: "Verification email sent successfully",data:{response}}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}