import fetch from 'node-fetch';

const botToken = "YOUR_BOT_TOKEN";

async function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`;
    await fetch(url, { method: "POST" });
}

async function forwardMessage(sourceChatId, targetChatId, messageId) {
    const url = `https://api.telegram.org/bot${botToken}/forwardMessage`;
    const formData = new FormData();
    formData.append("chat_id", targetChatId);
    formData.append("from_chat_id", sourceChatId);
    formData.append("message_id", messageId);

    await fetch(url, { method: "POST", body: formData });
}

export default { sendMessage, forwardMessage };

