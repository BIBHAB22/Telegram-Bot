// Import necessary modules
import connectDB from './connectdb.js';
const { connectToMongoDB, closeMongoDBConnection } = connectDB;
import telegramBot from './telegramBot.js';
const { sendMessage, forwardMessage } = telegramBot;

import { URL } from 'url';
// import FormData from 'form-data';

// Your bot token
const botToken = "YOUR_BOT_TOKEN";

// Function to handle incoming requests
async function handleRequest(request) {
    try {
        const { searchParams } = new URL(request.url);

        if (request.method === "POST" && searchParams.get("token") === botToken) {
            const body = await request.text();
            const update = JSON.parse(body);

            if (update.message && update.message.text) {
                const chatId = update.message.chat.id;
                const text = update.message.text;

                if (text.startsWith("/start")) {
                    await sendMessage(chatId, "Welcome to the Media Bot! Type /movie or /webseries to explore.");
                } else if (text.startsWith("/movie")) {
                    const movieName = text.split(" ")[1];
                    await sendMedia(chatId, "movie", movieName);
                } else if (text.startsWith("/webseries")) {
                    const webSeriesName = text.split(" ")[1];
                    await sendMedia(chatId, "web series", webSeriesName);
                } else {
                    await sendMessage(chatId, "Command not recognized. Type /start for instructions.");
                }
            }

            return new Response("OK", { status: 200 });
        } else {
            return new Response("Unauthorized", { status: 401 });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

// Function to send media (links) to the Telegram chat
async function sendMedia(chatId, mediaType, mediaName) {
    // Logic to retrieve the link to the media file from MongoDB based on type and name
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('media');

        // Query MongoDB to find the media link based on the provided mediaType and mediaName
        const media = await collection.findOne({ type: mediaType, name: mediaName });

        if (media) {
            // Forward the media link to the requesting chatId
            await sendMessage(chatId, `Here is your ${mediaType}: ${mediaName}\n${media.link}`);
        } else {
            await sendMessage(chatId, `${mediaType} not found.`);
        }
    } catch (error) {
        console.error('Error sending media:', error);
        await sendMessage(chatId, `Error sending ${mediaType}: ${mediaName}`);
    } finally {
        // Close the MongoDB connection
        await closeMongoDBConnection();
    }
}

// Add event listener for incoming requests
// addEventListener("fetch", (event) => {
//     event.respondWith(handleRequest(event.request));
// });
