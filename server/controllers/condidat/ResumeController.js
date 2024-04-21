const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const Resume = require("../../models/Resume");
const mongoose = require("mongoose");

const { BadRequestError } = require("../../errors/index");

require("dotenv").config();

const processResume = async (file) => {
  const apiUrl = process.env.AI_URL + "/process";
  const fileData = fs.createReadStream(file.path);

  const formData = new FormData();
  formData.append("resume", fileData);

  const response = await axios.request({
    method: "post",
    url: apiUrl,
    data: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
};

const deleteFile = async (filename) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    "condidat",
    "resume",
    filename
  );
  await fs.promises.unlink(filePath);
};

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }

    const { data } = await processResume(req.file);

    if (!mongoose.isValidObjectId(req.user._id)) {
      throw new BadRequestError("Invalid user ID");
    }

    const entity = new Resume({
      condidat: new mongoose.Types.ObjectId(req.user._id),
      name: req.file.originalname,
      path: req.file.filename,
      content: data,
    });

    const entitySaved = await entity.save();

    return res.status(201).json(entitySaved);
  } catch (error) {
    console.error("Error in uploadResume:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in uploadResume" });
  }
};

exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ condidat: req.user._id });

    return res.status(200).json(resumes);
  } catch (error) {
    console.error("Error in getResumes:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in getResumes" });
  }
};

exports.deleteResume = async (req, res, next) => {
  const { id } = req.params;
  try {
    const resume = await Resume.findOne({ _id: id, condidat: req.user._id });

    if (!resume) {
      throw new BadRequestError("Resume not found");
    }

    await Resume.deleteOne({ _id: id, condidat: req.user._id });
    await deleteFile(resume.path);

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error in deleteResume:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in deleteResume" });
  }
};
