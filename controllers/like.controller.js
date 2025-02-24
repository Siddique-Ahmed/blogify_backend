import { likeModel } from "../models/like.model.js";
import { postModel } from "../models/post.model.js";

// like post
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    // Pehle check karein ke user ne already like kiya hai ya nahi
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const existingLike = await likeModel.findOne({ post: postId, author: userId });

    if (existingLike) {
      // Unlike the post
      await likeModel.findByIdAndDelete(existingLike._id);
      await postModel.findByIdAndUpdate(postId, { $pull: { likes: existingLike._id } });
      return res.status(200).json({ message: "Post unliked", success: true });
    } else {
      // Like the post
      const newLike = await likeModel.create({ post: postId, author: userId });
      await postModel.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });
      return res.status(200).json({ message: "Post liked", success: true });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

export { likePost };