const express = require("express");
const User = require("./user.model");
const router = express.Router();
const generateToken = require("../middleware/generateToken");

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    return res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error registering user", err);
    // لو Duplicate Key Error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(400).send({ message: "Username already taken" });
    }
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  try {
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password not match" });
    }
    const token = await generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).send({ message: "User logged in successfully!",token, user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      profession: user.profession,
    }});
  } catch (err) {
    console.error("Error occurred while logging in user", err);
    res.status(500).send({ message: "Error occurred while logging in user" });
    }
});

// Logout endpoint
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "User logged out successfully!" });
});


// delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Error occurred while deleting user", err);
    res.status(500).send({ message: "Error occurred while deleting user" });
  }
}
);

// get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (err) { 
    console.error("Error occurred while getting users", err);
    res.status(500).send({ message: "Error occurred while getting users" });
  }
});

// update user role
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const users = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!users) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User role updated successfully!" });
  } catch (err) {
    console.error("Error occurred while updating user role", err);
    res.status(500).send({ message: "Error occurred while updating user role" });
  }
});


// edit or update profile
router.patch("/edit-profile", async (req, res) => {
  try {
    const { userId, username, email, profileImage, bio, profession } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const user = await User.findByIdAndUpdate(userId);
    console.log(user);
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // update profile
    if (username !== undefined) user.username = username;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (bio !== undefined) user.bio = bio;
    if (profession !== undefined) user.profession = profession;

    await user.save();
    res.status(200).send({
      message: "Profile updated successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
    } });

  } catch (err) {
    console.error("Error occurred while updating profile", err);
    res.status(500).send({ message: "Error occurred while updating profile" });
  }
});



module.exports = router;