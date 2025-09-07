import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets"; // adjust path if needed
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const [studentsData, setStudentsData] = useState(null);

  const fetchStudentsData = async () => {
    // In real case, replace dummyStudentEnrolled with API response
    setStudentsData(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  // Date formatter
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return studentsData ? (
    <div className="min-h-screen flex flex-col gap-8 md:p-8 p-4 pt-8">
      <div className="space-y-5 w-full">
        <h1 className="text-2xl font-semibold text-gray-800">
          Enrolled Students
        </h1>

        <div className="flex flex-col max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                  #
                </th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold">Enrollment Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {studentsData.map((item, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  {/* Serial Number */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>

                  {/* Student Image + Name */}
                  <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Profile"
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>

                  {/* Course Title */}
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>

                  {/* Enrollment Date */}
                  <td className="px-4 py-3">
                    {formatDate(item.purchaseDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
