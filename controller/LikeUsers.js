import User from "../model/Auth/Auth.model.js";

export const likeUser = async (req, res) => {
  try {
    const userId = req.body.id;                 // Logged-in user
    const targetUserId = req.body.targetUserId; 

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You cannot like yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    // Already liked
    if (user.likes.includes(targetUserId)) {
      return res.status(400).json({ message: "Already liked" });
    }

    // Step 1: Add like
    user.likes.push(targetUserId);
    targetUser.likedBy.push(userId);

    await user.save();
    await targetUser.save();

    // Step 2: Check if match already exists (target user also liked the user)
    const isMatch = targetUser.likes.includes(userId);

    if (isMatch) {
      // Add in matches
      user.matches.push(targetUserId);
      targetUser.matches.push(userId);

      await user.save();
      await targetUser.save();

      return res.status(200).json({
        message: "It's a Match! Now you both can chat.",
        match: true
      });
    }

    // Step 3: Just a like → send notification
    return res.status(200).json({
      message: "Like sent! Notification has been delivered.",
      match: false
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
