import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect()

export const POST = async(request: NextRequest) => {
    try {
        const reqBody = await request.json();
        const incomingToken = reqBody.token;
        
        const user = await User.findOne({verifyToken: incomingToken, verifyTokenExpiry: {$gt: Date.now()}})

        if(!user){
            return NextResponse.json({
                status: 400,
                message: "Token expired",
                success: false
            })
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save({validateBeforeSave: false});

        return NextResponse.json({
            status: 200,
            message: "User verified successfully",
            success: true
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}