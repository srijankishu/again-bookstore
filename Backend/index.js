import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 
import multer from 'multer';
import fs from 'fs';
import bookroute from './route/book.route.js';
import userroute from './route/user.route.js';
import Book from './book.model.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/files", express.static("files"))

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;

// MongoDB Connection Function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

// Check MongoDB connection status regularly
mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected! Attempting to reconnect...");
  connectToDatabase();  // Attempt to reconnect
});

// Root Route
app.get("/", async (req, res) => {
  res.send("Hello");
});

// Book Upload Route with Logging
app.post("/book", upload.single("file"), async (req, res) => {
  console.log("Request received at /book route");
  console.log("MongoDB connection state:", mongoose.connection.readyState);  // Check connection status
  
  try {
    const { id, title, name, author, price, image, category } = req.body;
    const fileName = req.file.filename;
    
    console.log("File:", req.file);  // Log file info
    console.log("Book data:", { id, title, name, author, price, image, category });  // Log request data

    await Book.create({
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
    console.log("Error in /book route:", error);
    res.status(500).send("Error uploading file");
  }
});

// Additional Routes
app.use("/book/", bookroute);
app.use("/user/", userroute);

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server app listening on port ${PORT}`);
});
