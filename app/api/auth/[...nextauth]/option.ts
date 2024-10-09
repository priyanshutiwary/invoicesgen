import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import connectDB from "@/backend/db"

import {User} from "@/backend/model/user"

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials: {
                email: {label:"Email", type:"text"},
                password: {label: "Password", type:"password"},
              },
              async authorize (credentials: any): Promise<any> {
                await connectDB()
                try {
                    
                    
                    
                    const user =await User.findOne({
                        $or: [
                            {contact: credentials.email},
                            {username: credentials.username}
                        ]

                    })
                    console.log("Fetched user:", user);

                    if(!user){
                        throw new Error('No user found with this email')
                    }

                    if(!user.isVerified){
                        throw new Error('please verify your account first')

                    }
                    

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    
                    if (isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("please check password")
                    }
                } catch (error:any) {
                    throw new Error(error)
                    
                }

                
              }
        })
    ],
    callbacks:{
        
        async session({session, token}) {
            if(token){
                session.user._id = token.id as string 
                session.user.isVerified = token.isVerified as boolean 
                session.user.username = token.username as string 

            }
            return session
        },
        async jwt({token, user}){
            if (user){
                token._id = user._id?.toString()
                token._isVerified = user.isVerified;
                token.username = user.username
            }
            return token
        },
    },
    pages: {
        signIn: '/sign-in'

    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}