const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
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

exports.generateResume = async (req, res, next) => {
  try {
    const data = {
      profile: {
        name: "Alice Smith",
        email: "alice@example.com",
      },
      aboutMe:
        "I am a dedicated and customer-oriented call center agent with experience in handling inbound and outbound calls. I possess excellent communication skills and thrive in fast-paced environments. My goal is to ensure customer satisfaction by providing timely and accurate assistance.",
      experience: [
        {
          title: "Call Center Agent",
          company: "ABC Call Center",
          duration: "2020 - Present",
          description:
            "Handle inbound customer inquiries regarding product information, order status, and issue resolution. Provide exceptional customer service by addressing concerns and resolving problems efficiently. Meet or exceed performance targets for call quality, customer satisfaction, and productivity.",
        },
        {
          title: "Customer Service Representative",
          company: "XYZ Solutions",
          duration: "2018 - 2020",
          description:
            "Assisted customers with account inquiries, billing questions, and technical support via phone, email, and live chat. Utilized CRM software to document customer interactions and follow up on unresolved issues. Collaborated with other departments to resolve complex customer issues and escalate as needed.",
        },
      ],
      skills: [
        "Excellent Communication",
        "Customer Service",
        "Problem Solving",
        "Time Management",
        "Active Listening",
        "Adaptability",
        "CRM Software",
        "Sales Techniques",
      ],
    };

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

    fs.writeFileSync("call_center.pdf", pdfBuffer);

    res.json({ success: true, path: "pdfPath" });
  } catch (error) {
    console.error("Error in generateResume:", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in generateResume" });
  }
};
