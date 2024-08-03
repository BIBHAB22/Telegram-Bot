import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://admin:HvlPkSq6XiWTZY9Q@moviesdatabase.l582ybs.mongodb.net/';
const dbName = 'server';

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function closeMongoDBConnection() {
    await client.close();
    console.log('Closed MongoDB connection');
}

export default { connectToMongoDB, closeMongoDBConnection };
