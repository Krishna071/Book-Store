import React, { useState } from "react";
import loginSignupImage from "../assest/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";
import { signinRedux } from "../redux/userSlice";
import { useDispatch } from "react-redux";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    checker: "",
    image : ""
  });
  const dispatch = useDispatch()

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((preve) => !preve);
  };


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleOnChecker = (e) => {
    var { name, value } = e.target;
    value = e.target.checked
    console.log(name,value)
    console.log("checker: ", e.target.checked)
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  

  const handleUploadProfileImage = async(e)=>{
      const data = await ImagetoBase64(e.target.files[0])
  

      setData((preve)=>{
          return{
            ...preve,
            image : data
          }
      })

  }


  // function handleCheckboxChange(event) {
  //   if (event.target.checked) {
  //     alert("Checkbox is checked");
  //     // Perform actions when the checkbox is checked
  //   } else {
  //     alert("Checkbox is unchecked");
  //     // Perform actions when the checkbox is unchecked
  //   }
  // }


console.log(process.env.REACT_APP_SERVER_DOMIN)
console.log("debug")
  const handleSubmit = async(e) => {
    e.preventDefault();
    const { firstName, email, password, confirmPassword,  contact } = data;
    if (firstName && email && password && confirmPassword  && contact) {
      if (password === confirmPassword) {
        
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/signup`,{
            method : "POST",
            headers : {
              "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })

          const dataRes = await fetchData.json()
    
        
        console.log(dataRes)
        if(dataRes.message === "Email id is already register"){
        toast("Email id is already registered")
        }
        else{
        toast("Welcome "+ dataRes.data.firstName +"!")
        if(dataRes.alert){
          navigate("/");
        }
        dispatch(signinRedux(dataRes))
        localStorage.setItem("data",  JSON.stringify(dataRes));

        console.log(dataRes)
      }
       
      } else {

        toast("password and confirm password not equal")
      }
    } else {
      alert("Please Enter required fields");
    }
  };

  return (
    <div className="signin">
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4">
        { <h1 className='text-ledt text-2xl font-bold'>Create User</h1> }
        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative ">
          <img src={data.image ? data.image :  loginSignupImage} className="w-full h-full" />

          <label htmlFor="profileImage">
            <div className="absolute bottom-0 h-1/3  bg-slate-500 bg-opacity-50 w-full text-center cursor-pointer">
              <p className="text-sm p-1 text-white">Upload</p>
            </div>
            <input type={"file"} id="profileImage" accept="image/*" className="hidden" onChange={handleUploadProfileImage}/>
          </label>
        </div>

        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type={"text"}
            id="firstName"
            name="firstName"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.firstName}
            onChange={handleOnChange}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type={"text"}
            id="lastName"
            name="lastName"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.lastName}
            onChange={handleOnChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type={"email"}
            id="email"
            name="email"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.email}
            onChange={handleOnChange}
          />

          <label htmlFor="contact">Contact Number</label>
          <input
            type={"text"}
            id="contact"
            name="contact"
            placeholder="Enter 10 digits phone number"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
            value={data.contact}
            onChange={handleOnChange}
          />


          <label htmlFor="password">Password</label>
          <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className=" w-full bg-slate-200 border-none outline-none "
              value={data.password}
              onChange={handleOnChange}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2  focus-within:outline focus-within:outline-blue-300">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmPassword"
              className=" w-full bg-slate-200 border-none outline-none "
              value={data.confirmPassword}
              onChange={handleOnChange}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowConfirmPassword}
            >
              {showConfirmPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>


{/* 
        <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2  focus-within:outline focus-within:outline-blue-300">
            <input type="checkbox" id="myCheckbox" onchange="handleCheckboxChange(event)"
            />
            <label for="myCheckbox">Biometric Authentication for Payment Transaction</label>
        </div> */}

          <div className="checkbox-wrapper">
            <label>
              <input type={"checkbox" }
              id="checker"
              name="checker"
              value={data.checker}
              onChange={handleOnChecker}    
             />
              <span>{" Biometric Authentication for Payment Transaction"}</span>
            </label>
          </div>


          <button type = "submit"className="w-full max-w-[150px] m-auto  bg-purple-500 hover:bg-indigo-600 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            Sign up
          </button>
        </form>
        <p className="text-left text-sm mt-2">
          Already have account ?{" "}
          <Link to={"/login"} className="text-purple-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Signup;
