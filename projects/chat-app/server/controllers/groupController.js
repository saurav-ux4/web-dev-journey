import Group from "../models/Group.js";


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