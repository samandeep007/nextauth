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
            from: 'noreply@web-trade.biz',
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #1a1a1a; /* Dark mode background color */
                        color: #ffffff; /* Text color for dark mode */
                    }
                    .container {
                        width: 100%;
                        max-width: 600px; /* Adjust max-width as needed for email width */
                        margin: 0 auto;
                        background-color: #f5f5f5; /* Light mode background color */
                    }
                    .header {
                        background-color: #000000; /* Dark mode header background color */
                        padding: 20px;
                        text-align: center;
                    }
                    .header img {
                        width: 200px; /* Set maximum width for the logo */
                        height: auto;
                        display: block; /* Ensure the image behaves correctly */
                        margin: 0 auto; /* Center the image */
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        background-color: #000000; /* Dark mode footer background color */
                        color: #ffffff; /* Text color for dark mode */
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                    }
                    .footer p {
                        margin: 0;
                    }
                    .footer a {
                        color: #ffffff; /* Link color in dark mode */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://ja-africa.org/wp-content/uploads/2020/02/FedEx-Logo-PNG-Transparent.png" alt="companyLogo">
                    </div>
                    <div class="content">
                        <p>Hi ${userId}!<br>
                        Please click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your account" : "reset your password"} or copy and paste the link below in your browser.</p><br>
                        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                    </div>
                    <div class="footer">
                        <p>&copy; Copyright 2024</p>
                    </div>
                </div>
            </body>
            </html>`
            ,
            };

          const mailResponse = await transporter.sendMail(mailOptions)

          return mailResponse

    } catch (error:any) {
         throw new Error(error.message);
      
    }
}