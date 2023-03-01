const braintree = require("braintree")
require("dotenv").config()

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req,res) => {
    console.log("generateToken triggered")
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).json({err})
        }else{
            res.send(response)
        }
    });
}
exports.processPayment = (req,res)=>{
    console.log(`processPayment, paymeenthMethodNonce is 
    ${req.body.paymentMethodNonce} and amount is ${req.body.totalPrice}`)
    gateway.transaction.sale({
        amount: req.body.totalPrice,
        paymentMethodNonce: req.body.nonce,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.send(result)
        }
    })
}