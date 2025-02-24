import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUriParser = async (file) => {
  try {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
  } catch (error) {
    console.log(error.message);
  }
};

export default getDataUriParser;
