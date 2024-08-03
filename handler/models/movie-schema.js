import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the Media schema
const mediaSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['movie', 'web series'],
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  }
});

// Create the Media model
const Media = mongoose.model('Media', mediaSchema);

export { Media };
