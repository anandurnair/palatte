import mongoose from 'mongoose';

const dbConnect = async (): Promise<void> => {
  try {
    // await mongoose.connect(process.env.MONGO_URI as string);
    await mongoose.connect('mongodb+srv://anandurpallam:1KWWjDmGeZz0GSPb@cluster0.7douifu.mongodb.net/palatte');

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default dbConnect;
