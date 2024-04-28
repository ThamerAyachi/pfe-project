const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const Resume = require("../../models/Resume");
const mongoose = require("mongoose");
const Joi = require("joi");

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

const aboutResume = async (jobTitle) => {
  const apiUrl = process.env.AI_URL + "/about";
  const response = await axios.request({
    method: "post",
    url: apiUrl,
    data: { job_title: jobTitle },
  });

  return response;
};

const fullUrlResume = (req, path) =>
  `${req.protocol}:\/\/${req.get("host")}/file/condidat-resume/${path}`;

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

    const result = resumes.map((resume) => ({
      _id: resume._id,
      condidat: resume.condidat,
      name: resume.name,
      content: resume.content,
      path: fullUrlResume(req, resume.path),
    }));

    return res.status(200).json(result);
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

const generateSchema = Joi.object({
  job_title: Joi.string().required(),
  main_color: Joi.string().required(),
  experience: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        company: Joi.string().required(),
        duration: Joi.string().required(),
        description: Joi.string().required(),
      })
    )
    .optional()
    .default([]),
  skills: Joi.array().items(Joi.string()).optional().default([]),
});

const generatePdf = async (data) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "views/resumes/base_resume.ejs"
  );
  const template = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = ejs.compile(template);
  const html = compiledTemplate({ ...data });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
};

exports.generateResume = async (req, res, next) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const response = await aboutResume(value.job_title);

    const data = {
      mainColor: value.main_color,
      profile: {
        name: `${req.user.firstName ?? ""} ${req.user.lastName ?? ""}`,
        email: `${req.user.email ?? ""}`,
        phone: `${req.user.phone ?? ""}`,
      },
      aboutMe: response.data.description,
      experience: [...value.experience],
      skills: [...value.skills],
    };

    const pdfBuffer = await generatePdf(data);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    fs.writeFileSync(
      "uploads/condidat/resume/" + uniqueSuffix + ".pdf",
      pdfBuffer
    );

    const entity = new Resume({
      condidat: new mongoose.Types.ObjectId(req.user._id),
      name: `${uniqueSuffix}.pdf`,
      path: `${uniqueSuffix}.pdf`,
      content: value.skills,
    });

    const entitySaved = await entity.save();

    return res.status(201).json(entitySaved);
  } catch (error) {
    console.error("Error in generateResume:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in generateResume" });
  }
};
