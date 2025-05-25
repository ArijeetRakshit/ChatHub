import express from "express"
import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io";
import cors from "cors";
import msgsRouter from "./routes/chat.route.js"
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgToConversation } from "./controller/chat.controller.js";
import { subscribe, publish } from "./redis/pubsubmsg.js";

dotenv.config()

const PORT = process.env.PORT || 8081
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
    }
})

const userSocketMap = {}

io.on("connection", (socket) => {
    const username = socket.handshake.query.username;
    userSocketMap[username] = socket;

    const channelName = `chat_${username}`
    subscribe(channelName, (msg)=>{
        socket.emit("chat_msg", JSON.parse(msg))
    })

    socket.on("chat_msg", (msg)=>{
        const receiverSocket = userSocketMap[msg.receiver]
        if(receiverSocket)
            receiverSocket.emit("chat_msg", msg);
        else{
            const channelName = `chat_${msg.receiver}`
            publish(channelName, JSON.stringify(msg))
        }

        addMsgToConversation([msg.sender, msg.receiver], {
                text: msg.text,
                sender:msg.sender,
                receiver:msg.receiver
            }
        )
    })
})

app.use("/msgs", msgsRouter)
app.get("/", (req, res)=>{
    res.send("Welcome to ChatHub")
})

server.listen(PORT, ()=>{
    connectToMongoDB()
    console.log(`Server is running at ${PORT}`)
})
