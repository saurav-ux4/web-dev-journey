import Message from "../models/Message.js";


// SEND MESSAGE
export const sendMessage = async (req, res) => {

  try {

    const { groupId, content } = req.body;

    const message = await Message.create({

      sender: req.user._id,

      group: groupId,

      content

    });

    const populatedMessage = await Message.findById(message._id)

      .populate("sender", "name email")

      .populate("group");

    res.status(201).json(populatedMessage);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET GROUP MESSAGES
export const getMessages = async (req, res) => {

  try {

    const messages = await Message.find({
      group: req.params.groupId
    })

      .populate("sender", "name email")

      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};