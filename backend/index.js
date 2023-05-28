const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require('stripe');
const { startVerification, verifyOTP } = require("./utils/bank-otp");
var contact=""

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection.
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema for username: fingerprint optional
// fingerprint -> image to base64 -> string format
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
  image: String
});

const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running at port 8000");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  contact = req.body.contact;
  console.log(contact);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    // console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
     
       res.send({
        message: "Successfully sign up",
        alert: true,
        data: data
       });
    }
  });
});



//api login
app.post("/login", (req, res) => {
   console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: req.body.email, password: req.body.password }, (err, result) => {
    console.log(result)
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
        contact: result.contact, 
      };
      console.log(dataSend);
      contact= dataSend.contact
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Invalid email or password!!",
        alert: true,
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
 
/*****payment getWay */

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
                  // images : [item.image]
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
          success_url : 'http://localhost:8000/Otp',
          cancel_url : `${process.env.FRONTEND_URL}/cancel`,
      }

      
      const session = await stripe.checkout.sessions.create(params)
      // console.log(session)
      res.status(200).json(session.id)
     }
     catch (err){
        res.status(err.statusCode || 500).json(err.message)
     }

})


// bank otp verification

app.get("/otp",async(req,res)=>{
 
  startVerification(contact)
  .then((success)=>console.log('success'))
  .catch((er)=>{ 
    console.log(er)
    res.send({message: "Enter the valid phone Number", alert : true})
  })
  res.redirect("http://localhost:3000/bankOtp")
})

app.post("/bankOtp",async(req,res)=>{
  
  // otp checker for otp verification
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
