const path = require("path");
const fs = require("fs").promises;

exports.getImages = async (req, res, next) => {
  try {
    const directories = req.params.directories.split("-");
    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "../../uploads",
      ...directories,
      filename
    );

    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    return res.status(404).json({ error: "File not found" });
  }
};
