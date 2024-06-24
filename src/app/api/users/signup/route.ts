import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bcryptjs from 'bcryptjs';
import {sendEmail} from '@/helpers/mailer'


connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User Already Exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10);
        const encryptedPassword = await bcryptjs.hash(password, salt);

        
        const newUser = new User({
            username: username,
            email: email,
            password: encryptedPassword
        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        

        //send verification email
       await sendEmail({email, emailType:"VERIFY", userId: username})
        console.log("Yahan tak sab theek hai")

        return NextResponse.json({
            message: "User Registered successfully",
            status: 200,
            savedUser,
            success: true
            
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}