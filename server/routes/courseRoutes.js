const express = require("express");
const courseRouter = express.Router();
const router = express.Router(); 
const { getAllCourses, getCourseById} = require("../controllers/coursesController");


// Other routes
courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCourseById);

module.exports = router;
 