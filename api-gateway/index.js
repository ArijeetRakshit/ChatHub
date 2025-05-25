import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"

dotenv.config();
const PORT = process.env.PORT || 8083;

const app = express()
const routes = {
   	"/api/auth": `${process.env.AUTH_BE_URL}:${process.env.AUTH_BE_PORT}/auth`,
   	"/api/users": `${process.env.AUTH_BE_URL}:${process.env.AUTH_BE_PORT}/users`,
   	"/api/msgs": `${process.env.CHAT_BE_URL}:${process.env.CHAT_BE_PORT}/msgs`
}

for(const route in routes) {
   const target = routes[route];
   app.use(route, createProxyMiddleware({target, changeOrigin: true}));
}

app.listen(PORT, () => {
   console.log(`api-gateway started listening on port : ${PORT}`)
})

