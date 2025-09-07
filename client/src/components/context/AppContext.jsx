import { createContext, use, useEffect } from "react";
import { dummyCourses } from "../../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext=createContext();
import humanizeDuration from 'humanize-duration';
import {useAuth,useUser} from "@clerk/clerk-react";

export const AppContextProvider=(props)=>{

    const currency=import.meta.env.VITE_CURRENCY;
    const navigate=useNavigate();

    const {getToken}=useAuth()
    const {user}=useUser();



    const [allcourses,setAllcourses]=useState([]);
    const [isEducator,setIsEducator]=useState(true);
    const [enrolledCourse,setEnrolledCourse]=useState([]);

    //Fetch all courses
    const fetchAllCourses=async()=>{
        setAllcourses(dummyCourses);
    }
    //Fetch uer Enrolled Courses
    const fetchUserEnrolledCourses=async()=>{
        setEnrolledCourse(dummyCourses);
    }


    useEffect(()=>{
        fetchAllCourses();
        fetchUserEnrolledCourses();
    },[])

    const logToken=async()=>{
        console.log(await getToken());
    }

    useEffect(()=>{
        if(user){
            logToken();
        }
    },[user])


    //Function to create average rating of the courses
    const calculateRating=(course)=>{
        if(course.courseRatings.length===0) return 0;
        let totalRating=0;
        course.courseRatings.forEach(rating => {
            totalRating+=rating.rating;
        });
        return totalRating/course.courseRatings.length;
    }

    //Function to calculate course chapter Time
    const calculateChapterTime=(chapter)=>{
        let time=0;
        chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
        return humanizeDuration(time*60*1000,{units:["h","m"]});
    }


    //Function to calculate course Duration
    const calculateCourseDuration=(course)=>{
        let time=0;
        course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration))
        return humanizeDuration(time*60*1000,{units:["h","m"]});
    }

    //Function to calculate total number of number of lectures in the course
    const calculateNoOfLectures=(course)=>{
        let totalLectures=0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }


     const value={
        currency,allcourses,navigate,calculateRating,isEducator,setIsEducator,calculateChapterTime,
        calculateCourseDuration,calculateNoOfLectures,
        enrolledCourse,fetchUserEnrolledCourses
    }


    return(
        <AppContext.Provider value={value}>
            {
                props.children
            }
        </AppContext.Provider>
    )
}