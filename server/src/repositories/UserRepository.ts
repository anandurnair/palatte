
import UserModel from "../models/user";
import CollectionModel from "../models/collections";
import PostModel from "../models/post";

class UserRepository {
  async findByEmail(email: string) {
    return await UserModel.findOne({ email }).populate('services');
  }

  async findById(userId: string) {
    return await UserModel.findById(userId).populate('services');
  }

  async createUser(userData: any) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async updateUser(userId: string, updateData: any) {
    return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async findOne(query: any) {
    return await UserModel.findOne(query);
  }

  async findOneAndUpdate(query: any, updateData: any) {
    return await UserModel.findOneAndUpdate(query, updateData, { new: true });
  }

  async findByIdAndUpdate(userId: string, updateData: any) {
    return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async getAllSavedPosts(userId: string) {
    const allSavedPosts = await CollectionModel.findOne({ user: userId, name: 'All' });
    return allSavedPosts ? allSavedPosts.posts : [];
  }

  async getPostsByUserId(userId: string) {
    return await PostModel.find({ userId });
  }

  async createCollection(collectionData: any) {
    const collection = new CollectionModel(collectionData);
    return await collection.save();
  }

  async findUsersByUsername(username: string) {
    const regex = new RegExp("^" + username.trim(), "i");
    return await UserModel.find({ username: regex });
  }
}

export default new UserRepository();
