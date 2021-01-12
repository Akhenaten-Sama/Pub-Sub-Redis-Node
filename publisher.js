const fetch = require('axios');
const express = require('express');
const redis = require('redis');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config()


//config for redis
const CONFIG = {
  url:process.env.URL,
  host:process.env.HOST,
  password:process.env.PASSWORD
}


//the publisher and subscriber
const publisher = redis.createClient(CONFIG);
const subscriber = redis.createClient(CONFIG);



const app = express();

app.use(express.json())
app.use(cors())

//stores our list of subscribers
var subscribers = []


//publishing endpoint
app.post('/publish/:topic',(req,res) => {
    const message = req.body;
    const topic = req.params.topic;
       console.log(message)
    try{
      publisher.publish(topic,JSON.stringify(message))
      res.status(200).send("Message has been published");
    }catch(err){
         res.status(501).send(err)
    }
    
})




//subscription endpoint
app.post('/subscribe/:topic', (req, res) => {
	var topic = req.params.topic;
	var url = req.body.url;
console.log('request received')
subscribers.push(url)


	try {
		subscriber.subscribe(topic);
		res.status(200).send({ url, topic });
	} catch (err) {
		res.status(501).send('unable to subscribe');
	}
	console.log(topic);
});


subscriber.on('message', (topic, data) => {
  console.log({ topic, data });
  subscribers.map(sub=>{
    fetch({
      method:'post',
      url:sub,
      data:{
        topic:topic,
        data:data
      },
      header:{'Content-Type':'application/x-www-form-urlencoded'}
    
    }).then(result => console.log('sent'))
    .catch(err=> console.log('error'))
  })
});







app.listen(process.env.PORT,() => {
    console.log(`server is listening on PORT ${process.env.PORT}`);
})