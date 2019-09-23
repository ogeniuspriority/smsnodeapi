const express = require('express')
require('dotenv').config()
var ApiUsername=process.env.ApiUsername.trim()
console.log("'"+ApiUsername+"'")
var apikey=process.env.apiKey.trim()
console.log("'"+apikey+"'")
const options = {
    apiKey:apikey ,         // use your sandbox app API key for development in the test environment
    username:ApiUsername ,      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(options);
const app = express(),
   bodyParser = require('body-parser');
const port = process.env.PORT || 3000
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'))

// POST method route
app.post('/sendSms', function (req, res) {
	console.log(req.body)
	
const { recipient, message, from } = req.body
//---Validation
//var phoneno = /^\+?\d{12}$/

  //if(!recipient.match(phoneno)){
  	 //res.status(500).send('Invalid phone number!')
  	 ////return;

  //}
const numbers = recipient.split(",")
let numbers_clean= [];
  for (var i = numbers.length - 1; i >= 0; i--) {
    numbers_clean.push(""+numbers[i].toString()+"")
  }
  //console.log(numbers_clean);
//const recipients_p = "["+numbers_clean.join()+"]"
//var objPhone=JSON.parse(recipients);
  if(message==""){
  	 res.status(500).send('Empty message!')
  	 return;
  }
  var from_new="";
 if (typeof from == 'undefined') {
  // your code here
  from_new = "BOOLAX"
}


// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

// Use the service
const optionpppp = {
	to: numbers_clean,    
    message: message,
    from: (from_new=="")?from:from_new
}

// Send message and capture the response or error
sms.send(optionpppp)
    .then( response => {
        console.log(response);
        res.status(200).send({
        	data:response,
        	message:"Message sent!"
        })
    })
    .catch( error => {
        console.log(error);
       res.status(500).send({
        	error,
        	message:"Message not sent!"+objPhone
        })
    });


  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))