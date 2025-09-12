const Course = require("../models/Course");

// Get all published courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select(
      "-courseContent -enrolledStudents"
    );

    // Manually add educator details
    const coursesWithEducator = await Promise.all(
      courses.map(async (course) => {
        const educator = await User.findById(course.educator).select("name imageUrl");
        return { ...course.toObject(), educator };
      })
    );

    res.status(200).json({
      success: true,
      courses: coursesWithEducator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove lecture URL if not preview free
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.status(200).json({
      success: true,
      courseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllCourses, getCourseById };
