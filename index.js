const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')
const app = express();
const port = 5000 || process.env.PORT;
connectToMongo();

app.use(express.json())
 
app.use(cors({
    origin :"https://i-notebook-frontend-kappa.vercel.app"
})) 
// respond with "hello world" when a GET request is made to the homepage
// app.get('/', (req, res) => {
//   res.send('hello ATISHAY')
// })

app.use('/api/auth' ,require('./routes/auth'));
app.use('/api/notes' ,require('./routes/notes'));

app.get("/",(req,res)=>{
    res.send("H1llo");
})


app.listen(port , ()=>{
    console.log(`iNotebook App is listening at http://localhost:${port}`);
})