'use client'
import React, { use, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();

const[user, setUser] = useState({
    email: "",
    password: "",
    username: ""
})

const[buttonDisabled, setButtonDisabled] = useState(true)
const[loading, setLoading] = useState(false)

const onSignUp = async() => {
    try {
        setLoading(true);
        const response = await axios.post('/api/users/signup', user)
        console.log("Signup success", response.data);

        router.push('/login')

    } catch (error: any) {
        console.log("Signup failed")
        toast.error(error.message);
    }
}

useEffect(()=>{
    if(user.email.length > 0 && user.password.length > 0 && user.email.length > 0){
        setButtonDisabled(false)
    }
    else{
        setButtonDisabled(true)
    }

},[user])

  return (
    <>
       
    </>
  )
}
