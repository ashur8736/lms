const express = require("express");
const { updateRoleToEducator, addNewCourse, getEducatorCourses, educatorDashboardData, getEnrolledstudentsData } = require("../controllers/educatorController");

const upload = require("../configs/multer"); 
const protectEducator  = require("../middlewares/authMiddleware");

const educatorRouter = express.Router();


educatorRouter.get("/update-role", updateRoleToEducator);

educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addNewCourse
);


educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledstudentsData);



module.exports = educatorRouter;
 