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
var numbers = recipient.split(",")
var numbers_clean= [];
  for (var i = numbers.length - 1; i >= 0; i--) {
    numbers_clean.push("'"+numbers[i].toString()+"'")
  }
var recipients = "["+numbers_clean.join()+"]"
  if(message==""){
  	 res.status(500).send('Empty message!')
  	 return;
  }


// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

// Use the service
const option = {
	to: recipients,    
    message: message,
    from: from
}

// Send message and capture the response or error
sms.send(option)
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
        	data:error,
        	message:"Message not sent!"+recipients
        })
    });


  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))