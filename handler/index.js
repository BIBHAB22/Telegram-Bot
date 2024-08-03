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
  try {
    await connectDB();
    const media = await Media.findOne({ type: mediaType, name: mediaName });
    await bot.sendMessage(chatId, `Please hang tight!! Wait for 5-10 seconds`);
    if (media) {
      await bot.deleteMessage(chatId);
      await bot.sendMessage(chatId, `Here is your ${mediaType}: ${mediaName}\n${media.url}`);
    } else {
      await bot.sendMessage(chatId, `${mediaType} not found.`);
    }
  } catch (error) {
    console.error('Error sending media:', error);
    await bot.sendMessage(chatId, `Error sending ${mediaType}: ${mediaName}`);
  } finally {
    await closeDBConnection();
  }
};

