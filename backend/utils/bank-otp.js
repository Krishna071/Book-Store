const accountSid = process.env.accountSid
const authToken = process.env.authToken
const verifySid = process.env.verifySid
const client = require("twilio")(accountSid, authToken);

const startVerification = (to)=> (new Promise(async (resolve,reject) =>{
    
    console.log("verification")
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to:'+91'+to, channel: "sms" })
      .then(() => resolve())
      .catch(er => {console.log(er)
                    reject()})

}))

const verifyOTP = (to, code) => (new Promise((resolve,reject)=>{
 //   (verification_check.valid) => (varification_check.valid == true) ? resolve(): reject()
    client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to:'+91'+to, code })
    .then((verification_check) => verification_check.valid)
    .then((verification) => {console.log("Verification Status:",verification);
     (verification == true) ? resolve(): reject()})
    .catch((er)=>{console.log(er), reject(er)})

}));


module.exports = {startVerification,verifyOTP}