export const acceptLike = async (req, res) => {
  try {
    const myId = req.user.id;
    const userId = req.params.userId;

    const me = await User.findById(myId);
    const otherUser = await User.findById(userId);

    const isLiked = me.likedBy.includes(userId);
    if (!isLiked) {
      return res.status(400).json({ message: "No like found from this user" });
    }

    // Create match
    me.matches.push(userId);
    otherUser.matches.push(myId);

    // Also add to likes list
    me.likes.push(userId);
    otherUser.likedBy.push(myId);

    await me.save();
    await otherUser.save();

    res.json({ message: "Match created successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
