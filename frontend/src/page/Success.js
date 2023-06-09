import React from 'react'
import { useSelector } from "react-redux";
import successPage from "../payImages/paymentimg.png"
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/userSlice";

const Success = () => {

  const dispatch = useDispatch();
  console.log("print success")
  const dataRes = localStorage.getItem('data');
  dispatch(loginRedux(JSON.parse(dataRes)));
  const userData = useSelector((state) => state.user);
  console.log("print", userData.email)

 const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh', // Adjust the height as needed
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '50%',
  };
  
  return (
  
   <div  style={{ backgroundColor: '#eeeee4' }}  >
    <div style={containerStyle} className='image-container'>
        <img src={successPage} alt="Payment Done Successfully!!" style={imageStyle} />
        {/* <a href="/" className="button">Back to Home Page</a> */}
    </div>

    <div className="homebtn"><a href="/" className="button">Back to Home Page</a></div>
    <div className='button-container'></div>

    </div> 
   

  )
}

export default Success