import { resend } from "@/backend/lib/resend";
import passwordResetCodeEmail from '@/emails/passcodeResetEmail'

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any; // Make data optional
}

export async function sendResetPasswordCode(
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("here");
        
        console.log(username,email,verifyCode);
        
        const response = await resend.emails.send({
            from: 'InvoiceGen <ResetPassword@invoicesgen.com>',
            to: email,
            subject: 'Use this code to reset password',
            react: passwordResetCodeEmail({username, otp: verifyCode}),
            
        })
        console.log(response);
        
        console.log("hello reset send");
        console.log(verifyCode);
        
        
        return {success: true, message: "Reset code sent successfully"}
    } catch (emailError) {
        console.error("Error sending reset code", emailError)
        return {success: false, message: "Failed to send reset code"}
    }
}