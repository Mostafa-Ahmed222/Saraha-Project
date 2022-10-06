import userModel from "../../../DB/model/User.js";
import messageModel from "../../../DB/model/Message.js";

export const addMessage = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  try {
    const user = await userModel
      .findOne({ _id: id, confirmEmail: true, deletedAt: true })
      .select("firstName");
    if (!user) {
      res.json({ message: "in-valid Id" });
    } else {
      const newMessage = new messageModel({ text, recievedId: id });
      const savedMessage = await (
        await newMessage.save()
      ).populate([
        {
          path: "recievedId",
          select: "-_id firstName lastName",
        },
      ]);
      res.json({ message: "Done", savedMessage });
    }
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await messageModel.findOneAndDelete({
      _id: id,
      recievedId: req.authUser.id,
    });
    message
      ? res.json({ message: "Done" })
      : res.json({ message: "in-valid id" });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const messageList = await messageModel.find({
      recievedId: req.authUser._id,
    });
    messageList.length
      ? res.json({ message: "Done", messageList })
      : res.json({ message: "No message found" });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
