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
    let media;
    if (mediaType === 'web series') {
      // Find multiple entries for web series
      // Ensure the keyword is a string and use it in a case-insensitive regex
      const regex = new RegExp(mediaName, 'i');

      // Find all media documents where type is 'web series' and name matches the regex
      const webSeries = await Media.find({
        type: 'web series',
        name: { $regex: regex }
      });
      // Extract URLs from the result
      const urls = webSeries.map(series => series.url);
      const names = webSeries.map(series => series.name);
      if (urls) {
        for(var i = 0; i < urls.length; i++) {
          await bot.sendMessage(chatId, `Here is your ${mediaType}: ${names[i]}\n${urls[i]}`);
        }
      } else {
        await bot.sendMessage(chatId, `${mediaType} not found.`);
      }
    } else {
      // Find a single entry for movies
      media = await Media.findOne({ type: mediaType, name: mediaName });
      if (media) {
        await bot.sendMessage(chatId, `Here is your ${mediaType}: ${mediaName}\n${media.url}`);
      } else {
        await bot.sendMessage(chatId, `${mediaType} not found.`);
      }
    }
  } catch (error) {
    console.error('Error sending media:', error);
    await bot.sendMessage(chatId, `Error sending ${mediaType}: ${mediaName}`);
  } finally {
    await closeDBConnection();
  }
};
