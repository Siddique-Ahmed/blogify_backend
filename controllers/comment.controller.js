import { commentModel } from "../models/comment.model.js";
import { postModel } from "../models/post.model.js";

// create comment
const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = req.params.postId;
    const userId = req.id;

    if (!comment) {
      return res.status(404).json({
        message: "comment is required!",
        success: false,
      });
    }

    const comments = await commentModel.create({
      comment,
      post: postId,
      author: userId,
    });

    const post = await postModel.findById(postId);

    await post.comments.push(comments._id);

    await post.save();

    return res.status(200).json({
      message: "Comment successfully!",
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

// update comment
const updateComment = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

export { createComment, updateComment, deleteComment };
