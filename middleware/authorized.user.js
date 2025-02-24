import jwt from "jsonwebtoken";

const isAuthorizedUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(404).json({
        message: "Unauthorized User",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(403).json({
        message: "Invalid Token",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

export default isAuthorizedUser;
