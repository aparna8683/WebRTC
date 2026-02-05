import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import http from "http";

const app=express()
const server = http.createServer(app);


const io=new Server(server,
    {
        cors:{
            origin: "http://localhost:5174",
                methods: ["GET", "POST"],

        }
    }
)
app.use(bodyParser.json())
server.listen(8000, ()=>{
    console.log("App is listening on Port 8000")
})

const emailToSocketMapping=new Map()
io.on('connection', (socket)=>{
    socket.on("join-room", data=>{
        const {roomId, emailId}=data
        console.log(`user joined room ${roomId}, withEmailId ${emailId}`)
        emailToSocketMapping.set(emailId, socket.id)
        socket.join(roomId)
        socket.emit("joined-room",{roomId})
        socket.broadcast.to(roomId).emit('user-joined',{emailId})
    })
})