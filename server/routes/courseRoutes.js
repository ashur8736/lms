const express = require("express");
const { getAllCourses, getCourseById } = require("../controllers/coursesController");

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCourseById);

module.exports = courseRouter; 
