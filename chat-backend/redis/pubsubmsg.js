import dotenv from "dotenv"
import Redis from "ioredis"

dotenv.config()

const redisHost = process.env.RUNNING_IN_DOCKER ? 'redis' : process.env.REDIS_HOST

const subscriber = new Redis({
    host: redisHost,
    port: process.env.REDIS_PORT,
})

const publisher = new Redis({
    host: redisHost,
    port: process.env.REDIS_PORT,
})

export const subscribe = (channel, callback) =>{
    subscriber.subscribe(channel, (err, count)=>{
        if(err){
            console.log("Error subscribing to channel: ", err);
            return;
        }
    })

    subscriber.on("message", (subscribedChannel, message)=>{
        if(subscribedChannel === channel)
            callback(message);
    })
}

export const unsubscribe = (channel) =>{
    subscriber.unsubscribe(channel, (err, count) => {
    if (err) {
        console.error('Error unsubscribing from channel:', err);
        return;
    }
    console.log(`Unsubscribed from ${channel}`);
    });
}


export const publish = async (channel, message) =>{
    try {
        await publisher.publish(channel, message);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}
