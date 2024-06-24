import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { connect } from "@/dbConfig/dbConfig";

connect()

export const POST = async (request: NextRequest) => {
    try {

     
        const reqBody = await request.json()
        const {email, password} = reqBody;
        
        const user = await User.findOne({email});
    
        if(!user){
            return NextResponse.json({
                status: 400,
                success: false,
                message: "User with these credentials doesn't exist"
            })
        }
       
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password).then(result => result);
    
        if(!isPasswordCorrect){
            return NextResponse.json({
                status: 400,
                success: false,
                message: "Check your credentials"
            })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'});

       

        const response = NextResponse.json({
            status: 200,
            success: true,
            data: user,
            message: "User logged-in successfully"
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }


}