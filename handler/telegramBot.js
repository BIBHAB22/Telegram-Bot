import fetch from 'node-fetch';
import FormData from 'form-data';

const botToken = "YOUR_BOT_TOKEN";

// Function to send a message to a Telegram chat
async function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("text", text);

    await fetch(url, { method: "POST", body: formData });
}

// Function to forward a message from one chat to another
async function forwardMessage(sourceChatId, targetChatId, messageId) {
    const url = `https://api.telegram.org/bot${botToken}/forwardMessage`;
    const formData = new FormData();
    formData.append("chat_id", targetChatId);
    formData.append("from_chat_id", sourceChatId);
    formData.append("message_id", messageId);

    await fetch(url, { method: "POST", body: formData });
}

export default { sendMessage, forwardMessage };


