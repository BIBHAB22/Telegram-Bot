import { Media } from "./movie-schema.js";
import mongoose from "mongoose";
import { connectDB } from "../utils/connectdb.js";
// Seed the database with demo data
const seedDatabase = async () => {
    try {
      await connectDB();
  
      // Insert demo data
      const demoData = [
        { type: 'movie', name: 'Inception', url: 'https://terabox.com/inception' },
        { type: 'movie', name: 'The Matrix', url: 'https://terabox.com/the-matrix' },
        { type: 'web series', name: 'Stranger Things', url: 'https://terabox.com/stranger-things' },
        { type: 'web series', name: 'Breaking Bad', url: 'https://terabox.com/breaking-bad' }
      ];
  
      await Media.insertMany(demoData);
      console.log('Database seeded with demo data');
    } catch (error) {
      console.error('Error seeding the database:', error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  // Run the script
  seedDatabase();