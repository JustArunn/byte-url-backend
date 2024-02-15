import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Please Login",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Error in jwt verificatoin", err);
        return res.status(500).json({ success: false, message: err });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log("Error", err.message);
  }
};
export { auth };
