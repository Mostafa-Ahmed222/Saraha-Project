import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../../../DB/model/User.js";
import sendMail from "../../../services/sendEmail.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("email");
    if (user) {
      res.json({ message: "Email Exist" });
    } else {
      const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashPassword,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.tokenEmailSignature,
        { expiresIn: 60 * 60 }
      );
      const link = `${req.protocol}://${req.headers.host}${process.env.BasedUrl}/auth/confirmEmail/${token}`;
      const message = `
        <p>please Follow this link to confirm your Email</p>
        <a href='${link}' style = 'text-decoration: 'none'>${link}</a>
        `;
      sendMail(savedUser.email, message);
      res.json({ message: "Done" });
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.tokenEmailSignature);
    const user = await userModel.updateOne(
      { _id: decoded.id, confirmEmail: false },
      {
        confirmEmail: true,
      },
      {
        new: true,
      }
    );
    user.modifiedCount
      ? res.json({ message: "Done please login" })
      : res.json({ message: "In-valid account or already confirmed" });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.deletedAt) {
      res.json({ message: "in-valid account or account maybe Deleted" });
    } else {
      if (!user.confirmEmail) {
        res.json({ message: "please confirm your email first" });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.json({ message: "in-valid account" });
        } else {
          const chekOnline = await userModel.updateOne(
            { email, isOnline: false },
            { isOnline: true }
          );
          if (!chekOnline.modifiedCount) {
            res.json({ message: "email already signedin" });
          } else {
            const token = jwt.sign(
              { id: user._id, isLoggedIn: true },
              process.env.tokensignature,
              {
                expiresIn: "22h",
              }
            );
            res.json({ message: "Done", token });
          }
        }
      }
    }
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
