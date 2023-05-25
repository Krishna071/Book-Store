import React, { useState } from "react";
import {toast} from "react-hot-toast"
import {useSelector  } from "react-redux";
import { Navigate,useNavigate} from "react-router-dom";

const BankOtp = () => {
  const navigate=useNavigate()
    const [data,setData] = useState({
        otp:""
      });
      
    const userData = useSelector(state => state.user)
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
   <div className="BankOtp">
    <div className="p-2 md:p-4">
       <div className="w-full max-w-sm bg-black m-auto flex  flex-col p-4 focus-within:outline-blue-400">   
           <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
                <div style={{ padding:"20px", borderRadius:"5px"}} >
                <h6 style={{color: "Green", fontSize: "30px", fontWeight: "bold"}} >Verify Number</h6>
                    <p style={{color: "white"}}>Enter OTP Send to the registered contact number</p>
                     
                    <input style={{color: "black"}} type="text" placeholder="Enter 6 digits OTP" name="otp"
                     className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                      value={data.otp}
                      onChange={handleOnChange}
                      /> 
                    <button type = "submit"className="w-full max-w-[100px] m-auto  bg-blue-200 hover:bg-purple-200 cursor-pointer  text-black text-l font-medium text-center py-1 rounded-full mt-2">
                    Submit
                  </button>
                  
                    </div>
          </form>
   </div>
   </div>
   </div>
  )
}

export default BankOtp