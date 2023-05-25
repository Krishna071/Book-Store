import React from 'react'
import { useSelector } from "react-redux";




const Cancel = () => {
  const userData = useSelector((state) => state.user);

console.log("print", userData.email)

  return (
    <div className='bg-red-200 w-full max-w-md m-auto h-36 flex justify-center items-center font-semibold text-lg'>
        <p>Payment is Cancel</p>
    </div>
  )
}

export default Cancel