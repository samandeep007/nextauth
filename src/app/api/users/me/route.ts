import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect()

export const GET = async (request: NextRequest) => {
    try {

        const decodedToken = await getDataFromToken(request);

        const userId = await User.findById(decodedToken);

        const user = await User.findById(userId).select("-password");

        if(!user){
            return NextResponse.json({
                status: 400,
                    message: "Invalid token",
                    success: false
            })
        }
    

        return NextResponse.json({
            status: 200,
                message: "User details fetched successfully",
                data: user,
                success: true
        })

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}