import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export const getDataFromToken = async (request:NextRequest) => {

try {
    const token = request.cookies.get("token")?.value || '';
    
    if(!token){
        return NextResponse.json({
            status: 400,
            message: "User is not logged-in",
            success: false
        })
    }
    
    const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!)

    return decodedToken.id

} catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500})
}
}