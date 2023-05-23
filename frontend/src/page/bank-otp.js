import React, { useState } from "react";
import {toast} from "react-hot-toast"
import {useSelector  } from "react-redux";
import { Navigate,useNavigate} from "react-router-dom";

const BankOtp = () => {
  const navigate=useNavigate()
    const [data,setData] = useState({
        otp:""
      });
      
    const userData = useSelector(state => state)
    console.log(userData)
    const handleOnChange = (e)=>{
    
        const {name,value} = e.target
        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
      }
   
    const handleSubmit = async(e)=>{
        e.preventDefault()

        const {otp} = data
        console.log(otp)
        if(otp ){
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/bankOtp`,{
            method : "POST",
            headers : {
              "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })
    
          const dataRes = await fetchData.json()
          console.log(dataRes)

          if(dataRes === true) {
            console.log("Success");
            navigate("/success");
          }
          else{
            console.log("Failed");
            navigate("/cancel");
          }
        }
        else{
            alert("Please Enter OTP")
        }
      }


  return (
    <div className="p-3 md:p-4">
       <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4">   
           <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
                <div style={{ padding:"20px", borderRadius:"5px"}} >
                <h2 style={{color: "Blue", fontSize: "40x"}} >Verify Number</h2>
                    <p style={{color: "Black"}}>Enter OTP Send to the registered contact number</p>
                     
                    <input style={{color: "black"}} type="text" placeholder="OTP" name="otp"
                      value={data.otp}
                      onChange={handleOnChange}
                      /> 
                    <button type = "submit"className="w-full max-w-[150px] m-auto  bg-red-500 hover:bg-red-600 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
                    Submit
                  </button>
                  
                    </div>
          </form>
   </div>
   </div>
  )
}

export default BankOtp