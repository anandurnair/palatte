import PostModel from "../models/post";
import UserModel from "../models/user";
import CommentModel from "../models/comment";
import CollectionModel from "../models/collections";
import ReportedPostsModel from "../models/reportedPosts";

class PostRepository {
  async createPost(postData: any) {
    const post = new PostModel(postData);
    return await post.save();
  }

  async findPostById(postId: string) {
    return await PostModel.findById(postId).populate("userId");
  }

  async findAllPosts() {
    return await PostModel.find().sort({ _id: -1 }).populate("userId");
  }

  async findPostsByUserId(userId: string) {
    return await PostModel.find({ userId }).sort({ _id: -1 });
  }

  async likePost(postId: string, userId: string) {
    return await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
  }

  async unlikePost(postId: string, userId: string) {
    return await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
  }

  async deletePost(postId: string) {
    await CommentModel.deleteMany({ postId });
    await ReportedPostsModel.deleteMany({ postId });
    return await PostModel.findByIdAndDelete(postId);
  }

  async updatePost(postId: string, updateData: any) {
    return await PostModel.findByIdAndUpdate(postId, updateData, { new: true });
  }

  async reportPost(reportData: any) {
    const report = new ReportedPostsModel(reportData);
    return await report.save();
  }

  async getReportedPosts() {
    return await ReportedPostsModel.find()
      .sort({ _id: -1 })
      .populate("postId")
      .populate("userId");
  }

  async savePostToCollection(userId: string, postId: string, collectionName: string) {
    let collection = await CollectionModel.findOne({ user: userId, name: collectionName });
    if (collection) {
      collection = await CollectionModel.findOneAndUpdate(
        { user: userId, name: collectionName },
        { $addToSet: { posts: postId } },
        { new: true }
      );
    } else {
      collection = new CollectionModel({ user: userId, name: collectionName, posts: [postId] });
      await collection.save();
    }

    await CollectionModel.findOneAndUpdate(
      { user: userId, name: "All" },
      { $addToSet: { posts: postId } }
    );

    return collection;
  }

  async removePostFromCollections(userId: string, postId: string) {
    const collections = await CollectionModel.find({ user: userId, posts: postId });
    for (const collection of collections) {
      collection.posts = collection.posts.filter((post: any) => post.toString() !== postId);
      await collection.save();
    }
    return collections;
  }

  async getAllSavedPosts(userId: string) {
    return await CollectionModel.find({ user: userId }).populate("posts");
  }

  async getCollectionsByUserId(userId: string) {
    return await CollectionModel.find({ user: userId });
  }
}

export default new PostRepository();
