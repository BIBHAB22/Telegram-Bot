import TelegramBot from 'node-telegram-bot-api';
import { connectDB, closeDBConnection } from './utils/connectdb.js';
import { Media } from './models/movie-schema.js'; 

const token = '6654683866:AAG6uiqmiszwv76mMBSMkvUsqPWZ78Auz5U';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Media Bot! Type /movie or /webseries to explore.');
  });

bot.onText(/\/movie (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movieName = match[1];
  await sendMedia(chatId, 'movie', movieName);
});

bot.onText(/\/webseries (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const webSeriesName = match[1];
  await sendMedia(chatId, 'web series', webSeriesName);
});

const sendMedia = async (chatId, mediaType, mediaName) => {
  let messageId;
  try {
    await connectDB();

    // Send a preliminary message indicating that the request is being processed
    const initialMessage = await bot.sendMessage(chatId, `Please hang tight!! Wait for 5-10 seconds`);
    messageId = initialMessage.message_id; // Capture the ID of the sent message

    // Query the database for the media
    const media = await Media.findOne({ type: mediaType, name: mediaName });

    if (media) {
      // Delete the initial message and send the media info
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(chatId, `Here is your ${mediaType}: ${mediaName}\n${media.url}`);
    } else {
      // Update the initial message if media not found
      await bot.editMessageText(`${mediaType} not found.`, { chat_id: chatId, message_id: messageId });
    }
  } catch (error) {
    console.error('Error sending media:', error);
    // Handle error case
    if (messageId) {
      await bot.editMessageText(`Error sending ${mediaType}: ${mediaName}`, { chat_id: chatId, message_id: messageId });
    }
  } finally {
    await closeDBConnection();
  }
};
