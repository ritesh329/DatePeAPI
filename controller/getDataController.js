import User from "../model/Auth/Auth.model.js";


const getData = async (req, res) => {
  try {
   
    const userData = await User.find();

   
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

  
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: userData,
    });

  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export default getData;
