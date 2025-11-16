import User from "../models/User.js";

export const isMatch = async (req, res, next) => {
  const myId = req.user.id;
  const targetId = req.params.userId;

  const user = await User.findById(myId);

  if (!user.matches.includes(targetId)) {
    return res.status(403).json({ message: "You can chat only with matched users" });
  }

  next();
};
