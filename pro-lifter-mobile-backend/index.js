const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    force: { type: String },
    level: { type: String, required: true },
    mechanic: String,
    equipment: { type: String },
    primaryMuscles: { type: [String], required: true },
    secondaryMuscles: [String],
    instructions: [String],
    category: { type: String, required: true },
    weightPerSet: [Number],
    repsPerSet: [Number],
    duration: Number,
    distance: Number,
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const workoutSchema = new mongoose.Schema(
  {
    exercises: { type: [exerciseSchema], required: true }, // array of exercises
    workoutName: { type: String, required: true }, // added a name for the entire workout
    date: { type: Date, default: Date.now }, // you can add more fields as needed
  },
  { timestamps: true }
);

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
  workouts: [workoutSchema],
});

const User = mongoose.model("User", userSchema);

// Login Endpoint
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
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
    res.status(200).json({ token, userId: user._id });
  }
});

app.get("/exercises", (req, res) => {
  fs.readFile(path.join(__dirname, "exercises.json"), "utf8", (err, data) => {
    if (err) {
      res.status(500).send("An error occurred while reading the file.");
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/muscles", (req, res) => {
  fs.readFile(path.join(__dirname, "exercises.json"), "utf8", (err, data) => {
    if (err) {
      res.status(500).send("An error occurred while reading the file.");
      return;
    }

    const exercises = JSON.parse(data).exercises;
    const primaryMuscles = new Set();
    exercises.forEach((exercise) => {
      exercise.primaryMuscles.forEach((muscle) => {
        primaryMuscles.add(muscle);
      });
    });

    musclesArray = Array.from(primaryMuscles);
    jsonMusclesArray = JSON.stringify(musclesArray);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonMusclesArray);
  });
});

app.post("/SaveWorkout", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add new workout to the user's workouts array
      user.workouts.push(req.body);

      // Save the updated user document
      await user.save();

      res.json({ message: "Workout saved successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

app.get("/workouts", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ workouts: user.workouts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

app.delete("/workouts/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find the index of the workout to be removed in the user's workouts array
      const workoutIndex = user.workouts.findIndex(
        (workout) => workout._id.toString() === req.params.id
      );

      // If the workout is not found, return a 404 error
      if (workoutIndex === -1) {
        return res.status(404).json({ message: "Workout not found" });
      }

      // Remove the workout from the user's workouts array
      user.workouts.splice(workoutIndex, 1);

      // Save the user with the modified workouts array
      await user.save();

      res.json({ success: true });
    } catch (error) {
      console.error(error); // Log the detailed error
      res.status(500).json({ message: error.message });
    }
  });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
