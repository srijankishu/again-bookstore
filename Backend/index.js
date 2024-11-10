import express from 'express';
import dotenv from 'dotenv';
import serveIndex from 'serve-index';
import mongoose from 'mongoose';
import bookroute from './route/book.route.js';
import userroute from './route/user.route.js';
import cors from 'cors'; 
import multer from 'multer';
import pdfDetails from './pdf.model.js';
import fs from 'fs';
import path from 'path';
import Book from './book.model.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/files", express.static("files"))

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
} catch (error) {
  console.log("Error", error);
}


app.get("/get-files", async (req, res) => {
  try {
    Book.find({}).then((data) => {
      res.send({
        status: "ok",
        data: data,
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './files';
    
    // Ensure the folder exists or create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() 
    cb(null,  uniqueSuffix+file.originalname)
  }
});

const upload = multer({ storage: storage });

app.post("/book", upload.single("file"), async (req, res) => {
  try {
    console.log("File details:", req.file);
    console.log("Request body:", req.body); // Log the entire request body
    
    const { id, title, name, author, price, image, category } = req.body;
    const fileName = req.file ? req.file.filename : null;

    if (!fileName) {
      return res.status(400).send("File upload failed.");
    }

    const book = await Book.create({
      id,
      name,
      author,
      title,
      price,
      image,
      category,
      pdf: fileName,
    });

    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error uploading file");
  }
});

app.post("/deleteBook", async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID format');
    }

   // console.log("Deleting book with ID:", id);
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).send('Book not found');
    }

    res.status(200).send('Book deleted successfully');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Error deleting book');
  }
});

app.use("/book", bookroute); 
app.use("/user", userroute); 

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server app listening on port ${PORT}`);
});
