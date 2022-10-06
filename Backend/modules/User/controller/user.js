import userModel from "../../../DB/model/User.js";
import bcrypt from "bcryptjs";

export const signout = async (req, res) => {
  const { _id } = req.authUser;
  try {
    const user = await userModel.updateOne(
      { _id },
      { isOnline: false, lastSeen: new Date() }
    );
    res.json({ message: "Done signed out successfully" });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const updateProfile = async (req, res) => {
  const { _id } = req.authUser;
  try {
    const user = await userModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json({ message: "Done", user });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const deleteProfile = async (req, res) => {
  const { _id } = req.authUser;
  try {
    const user = await userModel.deleteOne({ _id });
    res.json({ message: "Done", user });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const Allusers = async (req, res) => {
  try {
    const users = await userModel.find({ deletedAt: true , confirmEmail : true}).select("-password");
    if (!users.length) {
      res.json({ message: "Users Not found" });
    } else {
      res.json({ message: "Done", users });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const userProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.authUser._id);
    res.json({ message: "Done", user });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const softDelete = async (req, res) => {
  try {
    const user = await userModel.updateOne(
      { _id: req.authUser._id, deletedAt: true },
      { deletedAt: false }
    );
    res.json({ message: "Done", user });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const userTrash = async (req, res) => {
  try {
    const users = await userModel
      .find({ deletedAt: false })
      .select("-password");
    if (!users.length) {
      res.json({ message: "trash is empty" });
    } else {
      res.json({ message: "Done", users });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const shareProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findOne({_id : id, confirmEmail : true, deletedAt : true})
      .select("firstName lastName isOnline lastSeen");
      user ? res.json({ message: "Done", user }) : res.json({ message: "in-valid id"})
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRound)
    );
    const user = await userModel.updateOne(
      { _id: req.authUser._id },
      { password: hashPassword }
    );
    res.json({message : 'Done'})
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};