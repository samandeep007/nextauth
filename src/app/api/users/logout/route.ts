import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect()

export const GET = async (request: NextRequest) => {
    try {
        const response = NextResponse.json({
            message: "Logged-out successfully",
            success: true
        })

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0) //expiring the cookie
        });

        return response

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}