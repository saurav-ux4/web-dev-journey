import Group from "../models/Group.js";
import User from "../models/User.js";


// CREATE GROUP
export const createGroup = async (req, res) => {

  try {

    const { name } = req.body;

    const group = await Group.create({

      name,

      admin: req.user._id,

      members: [req.user._id]

    });

    res.status(201).json(group);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET USER GROUPS
export const getGroups = async (req, res) => {

  try {

    const groups = await Group.find({
      members: req.user._id
    });

    res.json(groups);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// ADD MEMBER TO GROUP
export const addMember = async (req, res) => {

  try {

    const { groupId, email } = req.body;

    // FIND USER
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // FIND GROUP
    const group = await Group.findById(groupId);

    if (!group) {

      return res.status(404).json({
        message: "Group not found"
      });

    }

    // ONLY ADMIN CAN ADD
    if (group.admin.toString() !== req.user._id.toString()) {

      return res.status(401).json({
        message: "Only admin can add members"
      });

    }

    // CHECK IF ALREADY MEMBER
    const alreadyMember = group.members.includes(
      userToAdd._id
    );

    if (alreadyMember) {

      return res.status(400).json({
        message: "User already in group"
      });

    }

    // ADD USER
    group.members.push(userToAdd._id);

    await group.save();

    res.json({
      message: "Member added successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};