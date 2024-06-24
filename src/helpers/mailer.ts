import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer'

export const sendEmail = async ({email, emailType, userId}:{email: string, emailType: string, userId: string}) => {
    try {

      const hashedToken = await bcryptjs.hash(userId, 10)
      //You can use UUID package here as well

        if(emailType === "VERIFY"){
          await User.findOneAndUpdate({userId}, {
            $set: {
              verifyToken: hashedToken,
              verifyTokenExpiry: Date.now() + 3600000
            }
          })
        }

        else if(emailType === "RESET"){
          await User.findByIdAndUpdate(userId, {
            $set: {
              forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry: Date.now() + 3600000
            }
          })
        }


        const transporter = nodemailer.createTransport({
          host: "live.smtp.mailtrap.io",
          port: 587,
          auth: {
            user: process.env.MAILTRAP_USERNAME, // For testing purposes
            pass: process.env.MAILTRAP_PASSWORD
          }
        });

          const mailOptions = {
            from: 'samandeep@demomailtrap.com',
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<div style="background-color: rgb(245, 245, 245); width: 100%; margin: 0; padding: 0; height: auto">
                  <div style="width: 95%; margin: 0 auto; background-color: black; padding: 30px; color: white; display: flex; align-items: center; justify-content: center; margin-top: 10px"><img src="https://imgs.search.brave.com/OV0evwyZ2XnkKMhawkWFQHwt3eLQHTqGOrAXpr7FRBo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dC5icmFuZGZldGNo/LmlvL2lkMmFsdWUt/cngvaWRkaFcwWW1l/US5wbmc_dXBkYXRl/ZD0xNzE0NTU2MjMx/OTc4" alt="companyLogo" height="40rem" width="200rem"></div>
                   <div style="padding: 20px; padding-bottom: 200px">
                    Hi ${userId}! <br/>
                   <p>Please click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY"? "verify your account" : "reset your password"} or copy and paste the link below in your browser.</p><br>
                   ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                   </div>
                   <div style="width: 95%; margin: 0 auto; background-color: black; padding: 30px; color: white; text-align: center; font-family:Arial, Helvetica, sans-serif">Copyright 2024</div></div>`,
            };

          const mailResponse = await transporter.sendMail(mailOptions)

          return mailResponse

    } catch (error:any) {
         throw new Error(error.message);
      
    }
}