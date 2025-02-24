import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
import { imageUpload } from "../utils/cloudinary.js";
import getDataUriParser from "../utils/data.uri.js";

// create post
const createPost = async (req, res) => {
  try {
    const { title, description, isPublished } = req.body;
    const bgCover = req.file;
    const userId = req.id;

    if (!title || !description || !isPublished) {
      return res.status(404).json({
        message: "Please provide all required fields!",
        success: false,
      });
    }

    const dataUrl = await getDataUriParser(bgCover);
    const bgCoverUrl = await imageUpload(dataUrl.content);

    const post = await postModel.create({
      title,
      description,
      isPublished,
      backgroundImage: bgCoverUrl.secure_url,
      user: userId,
    });

    const user = await userModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $post: {
          $pull: {
            post: post._id,
          },
        },
      },
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    res.status(201).json({
      message: "post created successfully!",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// update post
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description, isPublished } = req.body;
    const bgCover = req.file;

    const updatedPost = await postModel.findById(postId);

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    if (!bgCover) null;

    const dataUrl = await getDataUriParser(bgCover);
    const bgCoverUrl = await imageUpload(dataUrl.content);

    if (title) updatedPost.title = title;
    if (bgCoverUrl) updatedPost.backgroundImage = bgCover.secure_url;
    if (description) updatedPost.description = description;
    if (isPublished) updatedPost.isPublished = isPublished;

    await updatedPost.save();

    return res.status(200).json({
      message: "post updated successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// delete post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel.findById(postId);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// get user posts
const getUserPosts = async (req, res) => {
  try {
    const userId = req.id;

    const userPosts = await postModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "Comment",
          localField: "comment",
          foreignField: "_id",
          as: "Comment",
        },
      },
      {
        $lookup: {
          from: "Like",
          localField: "like",
          foreignField: "_id",
          as: "Like",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          backgroundImage: 1,
          isPublished: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          comment: {
            _id: "$Comment._id",
            comment: "$Comment.comment",
            createdAt: "$Comment.createdAt",
            user: {
              _id: "$Comment.user._id",
              name: "$Comment.user.name",
              email: "$Comment.user.email",
            },
          },
          likes: {
            _id: "$Like._id",
            user: {
              _id: "$Like.user._id",
              name: "$Like.user.name",
              email: "$Like.user.email",
            },
            createdAt: "$Like.createdAt",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!userPosts) {
      return res.status(404).json({
        message: "no post available!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      post: userPosts,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "Comment",
          localField: "comment",
          foreignField: "_id",
          as: "Comment",
        },
      },
      {
        $lookup: {
          from: "Like",
          localField: "like",
          foreignField: "_id",
          as: "Like",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          backgroundImage: 1,
          isPublished: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          comment: {
            _id: "$Comment._id",
            comment: "$Comment.comment",
            createdAt: "$Comment.createdAt",
            user: {
              _id: "$Comment.user._id",
              name: "$Comment.user.name",
              email: "$Comment.user.email",
            },
          },
          likes: {
            _id: "$Like._id",
            user: {
              _id: "$Like.user._id",
              name: "$Like.user.name",
              email: "$Like.user.email",
            },
            createdAt: "$Like.createdAt",
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!posts) {
      return res.status(404).json({
        message: "No posts available!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// get post by id
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await postModel.aggregate([
      {
        $match: {
          _id: postId,
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "Comment",
          localField: "comment",
          foreignField: "_id",
          as: "Comment",
        },
      },
      {
        $lookup: {
          from: "Like",
          localField: "like",
          foreignField: "_id",
          as: "Like",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          backgroundImage: 1,
          isPublished: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          comment: {
            _id: "$Comment._id",
            comment: "$Comment.comment",
            createdAt: "$Comment.createdAt",
            user: {
              _id: "$Comment.user._id",
              name: "$Comment.user.name",
              email: "$Comment.user.email",
            },
          },
          likes: {
            _id: "$Like._id",
            user: {
              _id: "$Like.user._id",
              name: "$Like.user.name",
              email: "$Like.user.email",
            },
            createdAt: "$Like.createdAt",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

export {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getPostById,
};
