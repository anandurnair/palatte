import CommentModel from "../models/comment";
import ReportedCommentsModal from "../models/reportComments";

class CommentRepository {
  async addComment(commentData: any) {
    const newComment = new CommentModel(commentData);
    return await newComment.save();
  }

  async findCommentsByPostId(postId: string) {
    return await CommentModel.find({ postId, parentCommentId: null })
      .populate("userId")
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          model: 'Users',
        },
      })
      .sort({ _id: -1 });
  }

  async findCommentById(commentId: string) {
    return await CommentModel.findById(commentId);
  }

  async deleteCommentById(commentId: string) {
    return await CommentModel.findByIdAndDelete(commentId);
  }

  async findAllComments() {
    return await CommentModel.find();
  }

  async addReply(replyData: any) {
    const newReply = new CommentModel(replyData);
    return await newReply.save();
  }

  async updateComment(commentId: string, updateData: any) {
    return await CommentModel.findByIdAndUpdate(commentId, updateData, { new: true });
  }

  async reportComment(reportData: any) {
    const newReport = new ReportedCommentsModal(reportData);
    return await newReport.save();
  }

  async getDistinctUserCount(commentId: string) {
    return (await ReportedCommentsModal.distinct("userId", { commentId })).length;
  }

  async deleteReportedComments(commentId: string) {
    return await ReportedCommentsModal.deleteMany({ commentId });
  }

  async getAllReportedComments() {
    const allReports = await ReportedCommentsModal.find()
      .sort({ _id: -1 })
      .populate('userId')
      .populate('postId')
      .populate('commentId');
    return allReports.map((report: any) => ({
      reportId: report._id,
      postImg: report.postId.images,
      postId: report.postId._id,
      username: report.userId.username,
      comment: report.commentId.comment,
      reason: report.reason,
      status: report.commentId.isBlocked ? "Not active" : 'active',
    }));
  }
}

export default new CommentRepository();
