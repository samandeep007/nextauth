import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export const POST = async(request:NextRequest)=>{
    try {
        const reqBody = await request.json();
        const {username} = reqBody;

        if(!username){
            return NextResponse.json({
                status: 400,
                message: "User didn't provide username",
                success: false
            })
        }

        const user = await User.findOne({username: username});

        if(!user){
            return NextResponse.json({
                status: 400,
                message: "User with this username doesn't exist",
                success: false
            })
        }

        await sendEmail({email: user.email, emailType:"RESET", userId: username});

        return NextResponse.json({
            status: 200,
            message: "Password reset mail sent successfully",
            success: true
        })
        
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

