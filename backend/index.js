const express = require("express");
const cookieParser = require('cookie-parser'); 
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require('stripe');
const { startVerification, verifyOTP } = require("./utils/bank-otp");
const fs = require('fs');
const path = require('path');
const http = require('http');
const { urlencoded } = require("body-parser");


const app = express();
app.use(cors({origin: '*'}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
const PORT = process.env.PORT || 8080;

//mongodb connection.
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema for user
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  contact:String,
  checker: String,
  image: String
});

const userModel = mongoose.model("user", userSchema);

// password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
const yourPassword = "someRandomPasswordHere";

//api
app.get("/", (req, res) => {
  res.send("Server is running at port 8000");
});

// initialize the var for contact number and biometric checker
var contact="", checker="";
//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  contact = req.body.contact;
  checker = req.body.checker
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    // console.log(result);
    console.log(err);
    if (result) {
      // email should be unique during signup
      console.log("Email id is already register")
      const data = "null"
      res.send({ message: "Email id is already register", alert: true, data: data });
    } else {
      console.log(req.body.password)
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        // Now we can store the password hash in db.
        req.body.password = hash
        console.log(hash)
        req.body.confirmPassword = hash
      const data = userModel(req.body);
       data.save(); 
       res.send({
        message: "Successfully sign up", alert: true, data: data
       });
       
      });
      
    }
  });
});



//user login 
app.post("/login", (req, res) => {
  //check for email and password in database
  
  userModel.findOne({ email: req.body.email }, (err, result) => {
    console.log(result)
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
        contact: result.contact, 
        checker: result.checker,
        password: result.password
      };
      //print user's info
      // console.log("og password ", req.body.password)
      // console.log("db password ", dataSend.password)
      
      bcrypt.compare(req.body.password, dataSend.password, (err, result) => {
        if (err) {
          // Handle error
          console.log(err)
        } else if (result === true) {
          // Passwords match
          console.log('Passwords match!');
          res.send({
            message: "Login is successfully", alert: true, data: dataSend
          });
        } else {
          // Passwords don't match
          console.log('Passwords do not match!');
          res.send({
            message: "Sorry, your password was incorrect", alert: true, data: dataSend
          });
        }
      });
    } else {
      res.send({
        message: "Invalid email or password!!", alert: true
      });
    }
  });
});

//books section
const schemaBook = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("books",schemaBook)



//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
    // console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Upload successfully"})
})

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})
 
   //payment getWay integration
    const stripe  = new Stripe(`${process.env.STRIPE_SECRET_KEY}`)
    app.post("/create-checkout-session",async(req,res)=>{
    try{
      const params = {
          submit_type : 'pay',
          mode : "payment",
          payment_method_types : ['card'],
          billing_address_collection : "auto",
          shipping_options : [{shipping_rate : "shr_1N3m3sSF91miOUEQMdUtpt1d"}],
          line_items : req.body.map((item)=>{
            return{
              price_data : {
                currency : "inr",
                product_data : {
                  name : item.name,
                },
                unit_amount : item.price * 100,
              },
              adjustable_quantity : {
                enabled : true,
                minimum : 1,
              },
              quantity : item.qty
            }
          }),
          success_url : `${process.env.BACKEND_URL}/VerificationMode`,
          cancel_url : `${process.env.FRONTEND_URL}/cancel`,
    }
      const session = await stripe.checkout.sessions.create(params)
      res.status(200).json(session.id)
     }
     catch (err){
        res.status(err.statusCode || 500).json(err.message)
    }
})

// biometric auth or bank otp verification after payment gateway
app.get("/verificationMode", async(req,res)=>{
     console.log(checker)

     if(checker == true || checker == "true"){
        
        res.redirect(`${process.env.BACKEND_URL}/biometric`)
     }else{
       
        res.redirect(`${process.env.BACKEND_URL}/otp`)
     }
 
})

//biometric identification
app.get("/biometric", async(req,res)=>{

    const filePath = path.join(__dirname, './biometric.html');
    res.sendFile(filePath);

})

// bank otp verification
// send otp to user contact number
app.get("/otp",async(req,res)=>{
  startVerification(contact)
  .then((success)=>console.log('success'))
  .catch((er)=>{ 
    console.log(er)
    res.send({message: "Enter the valid phone Number", alert : true})
  })
  res.redirect(`${process.env.FRONTEND_URL}/bankOtp`)
})

 // otp verification
app.post("/bankOtp",async(req,res)=>{
  let otpChecker =""
  console.log("OTP", contact, req.body.otp)
  verifyOTP(contact, req.body.otp)
  .then(async ()=>{
    console.log("succesfull otp verification done");
    otpChecker = "true"
  }).catch ((er)=>{console.log(er); console.log("Otp verification failed");otpChecker ="false"} )
  .finally(() => {console.log(otpChecker), res.send(otpChecker)})
})


//server is ruuning
app.listen(PORT, () => console.log("server is running  : " + PORT));
