import User from "../models/User.js";

export async function getAccount(req, res) {
  const user = req.user;

  res.json({
    profile: {
      displayName: user.displayName,
      role: user.role,
      email: user.email,
      emailVerified: true,
    },
    accounts: [
      {
        id: user._id,
        name: user.displayName,
        email: user.email,
        active: true,
      },
    ],
  });
}

export async function updateProfile(req, res) {
  try {
    const { displayName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (displayName) user.displayName = displayName;
    await user.save();

    res.json({
      displayName: user.displayName,
      role: user.role,
      email: user.email,
      emailVerified: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
}