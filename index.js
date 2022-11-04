const express = require('express');
const userRoute = require('./routes/user.route');
const port = 8000;
const app = express();


app.use(express.json());

app.use('/user',userRoute)

app.get('/',(req,res)=> {
    res.send('server running')
})

app.listen(port,()=> {
    console.log(`server running at port : ${port}`);
})