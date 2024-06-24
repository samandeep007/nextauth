'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter();
  const[data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      await axios.get('/api/users/me').then(res => setData(res.data.data._id))
      toast.success("User fetched")
   

    } catch (error:any) {
      toast.error(error.message)
      console.log(error)
    }
  }


  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success("Logout success");
      router.push('/login')
      
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message)
    }
  }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile Page</h1>
      <hr />

      <h2>{data === "nothing" ? "Nothing" : <Link href={`/profile/${data}`}>Test : {data}</Link>}</h2>
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Logout</button>

        <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >GetUser Details</button>


           
    </div>
  )
}
