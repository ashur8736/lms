import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const path = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 aspect-square rounded-full animate-spin border-4 border-gray-300 border-t-blue-400"></div>
    </div>
  );
};

export default Loading;
