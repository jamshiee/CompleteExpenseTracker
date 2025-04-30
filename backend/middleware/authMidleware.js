import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req?.headers?.cookie;


  if (!authHeader || !authHeader?.startsWith("jwt")) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }

  const token = authHeader?.split("=")[1];
  


//   const authHeader = req?.headers?.authorization;

//   if (!authHeader || !authHeader?.startsWith("Bearer")) {
//     return res.status(401).json({
//       message: "Authentication failed",
//     });
//   }

//   const token = authHeader?.split(" ")[1];

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication Internal Failed",
    });
  }
};
export default authMiddleware;
