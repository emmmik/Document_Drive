// TODO:
//   - File icons
//   - Shortening documents name

const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const Users = require('./src/loginSchema');
const Documents = require('./src/documentSchema');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://emmikcp:GsEAD7CN7FHxLhxc@cluster0.zpphpix.mongodb.net/Document_Drive");
const multer = require('multer');
const fs = require('fs');
const { IncomingMessage } = require('http')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.originalname.split(".");
    let extension = extArray[extArray.length - 1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
  }
})

const upload = multer({ storage: storage });

// check connection
connect.then(() => {
    console.log("Database connected successfully!");
})
.catch(() => {
    console.log("Database cannot be reached");
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('static'));
app.use(express.json());

app.post('/register', async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  }

  const existingUser = await Users.findOne({name: data.name});

  if (existingUser) {
    res.json({success: false, message: "User already exists"});
  } else {
    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    const userdata = await Users.insertMany(data);
    //console.log(userdata);
    res.json({success: true, message: "Your account was successfully created"});
  }
});

app.post('/login', async (req, res) => {
  try {
    // check if user exists
    const check = await Users.findOne({name: req.body.username});
    if (!check) {
      res.json({success: false, message: "The user is not found"});
    }

    // check if the passwords match
    if (check) {
      const isMatch = await bcrypt.compare(req.body.password, check.password);
      if (isMatch) {
        res.json({success: true, message: "Successfully logged in", username: req.body.username});
      } else {
        res.json({success: false, message: "False username or password"});
      }
    }
  } catch {
    console.log("Sorry, an error occured");
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newDocument = {
      user: req.headers.username,
      originalname: req.file.originalname,
      filename: req.file.filename,
      filepath: req.file.path,
      filesize: req.file.size / 1024 / 1024,
      keywords: []
    };
    const documetdata = await Documents.insertMany(newDocument);
    //console.log('hello');
    res.json({ success: true, message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/user_docs', async (req, res) => {
  //console.log(typeof req.headers.username);
  try {
    const user = await Users.findOne({name: req.headers.username});
    if (!user) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    const userDocuments = await Documents.find({user: user.name});

    res.json({ success: true, documents: userDocuments });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/get_document', async (req, res) => {
  try {
    const currentDocument = await Documents.findOne({filename: req.headers.fileid});
    if (!currentDocument) {
      return res.status(404).json({success: false, message: 'Document not found'});
    }
    
    res.json({success: true, doc: currentDocument});
  } catch {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/upload_keywords', async (req, res) => {
  try {
    const currentDocument = await Documents.findOne({filename: req.body.fileid});
    if (!currentDocument) {
      return res.status(404).json({success: false, message: 'Document not found'});
    }
    const updatedDocument = await Documents.findOneAndUpdate(
      { filename: req.body.fileid },
      { $set: { keywords: req.body.keywordsArray } },
      { new: true }
    );
    res.json({success: true});
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/search', async (req, res) => {
  try {
    //console.log(req.body.searchInput);
    const namesFound = await Documents.find({$or: [{originalname: {$regex: new RegExp(req.body.searchInput, 'i')}, user: req.body.username}, {keywords: {$in: [new RegExp(req.body.searchInput, 'i')]}, user: req.body.username}]});
    //console.log(namesFound, typeof namesFound);
    // const keywordsFound = await Documents.find({keywords: {$in: [new RegExp(req.body.searchInput, 'i')]}, user: req.body.username});
    // // const keywordsFound = await Documents.find({});
    // let mergedResults = namesFound.concat(keywordsFound);
    // let endDocuments = Array;
    // console.log(typeof mergedResults);
    // mergedResults.forEach(element => {
    //   if (!endDocuments.includes(element)) {
    //     endDocuments.push(element);
    //   }
    // });
    res.json({success: true, documents: namesFound});
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/delete_document', async (req, res) => {
  try {
    const currentDocument = await Documents.findOne({filename: req.body.fileid});
    if (!currentDocument) {
      return res.status(404).json({success: false, message: 'Document not found'});
    }
    fs.unlinkSync(`public/uploads/${currentDocument.filename}`);
    await Documents.findByIdAndDelete(currentDocument._id);
    res.json({success: true});
  } catch {
    console.error('An error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});