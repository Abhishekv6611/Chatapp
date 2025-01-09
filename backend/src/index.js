import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv'
import { ConnectDb } from './lib/db.js'
import cookiParser from "cookie-parser"
import cors from 'cors'
import path from 'path'
import { app,server } from './lib/socket.js'


dotenv.config()
app.use(express.json({ limit: '10mb' })); // Set the limit to 10MB
app.use(cookiParser())

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))

const PORT=process.env.PORT
const __dirname=path.resolve()

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))

  })

}

server.listen(PORT,()=>{
    console.log("Server is Running on port:"+PORT);
    ConnectDb()
})