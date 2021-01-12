const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors())

// subscriber url 1
app.post('/test1', (req,res)=>{
    const data = req.body
    console.log(data)
    res.status(200)
     return data
    
})


//subscriber url 2
app.post('/test2', (req,res)=>{
    const data = req.body
    console.log(data)
    res.send('received')
    return data
})

app.listen(process.env.PORT_1, () => {
	console.log(`subscriber 2 is up and listening to port ${process.env.PORT_1}`);
});
