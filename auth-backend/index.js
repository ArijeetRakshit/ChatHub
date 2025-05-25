import express from "express"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import usersRouter from "./routes/users.route.js"

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json()); // Parses incoming requests with a JSON body
app.use(cookieParser()); // Parses cookies from the request header into req.cookies
app.use(cors({
    credentials: true, // Backend to receive and respond to cross-origin requests that contain credentials (like cookies).
    origin: ["http://localhost:3000", "http://localhost:3001"] 
}))


app.use('/auth', authRouter); 
app.use('/users', usersRouter);

app.get('/', (req, res) => {
   res.send("Welcome to ChatHub");
});


app.listen(PORT, () => {
   connectToMongoDB();
   console.log(`Server is listening at ${PORT}`);
})

