import mongoose, { connection } from 'mongoose';

export async function connect (){
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/nextjs` || '')
        const connectionReference = mongoose.connection;

        connectionReference.on('connected', ()=> {
            console.log('MongoDB Connected');
        })

        connectionReference.on('error', (err)=>{
            console.log("MongoDB connection error, please make sure db is up and running " + err);
            process.exit()
        })

        
    } catch (error) {
        console.log('Something went wrong while connecting to the database');
        console.log(error);
    }
}