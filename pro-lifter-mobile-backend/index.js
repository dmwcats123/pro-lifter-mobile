const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a User Schema and Model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Login Endpoint
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ message: "Login Successful!" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Sign Up Endpoint
app.post("/SignUp", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: "Email already registered" });
  } else {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(200).json({ message: "Registration Successful!" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
