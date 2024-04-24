import mongoose from 'mongoose';

const dbConnect = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost:27017/palatte');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default dbConnect;
