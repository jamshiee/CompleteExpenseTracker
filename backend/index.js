import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import routes  from './routes/route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
    origin: "http://localhost:5174", // 👈 your frontend origin
  credentials: true 
}));
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));


app.use("/api",routes);

// app.use("*",(req,res)=>{
//     res.status(404).json({
//         message:"Route not found"
//     })
// })

app.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`)
})

