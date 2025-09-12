import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../components/context/AppContext'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'

const MyCourses = () => {

  const {currency,backendurl,isEducator,getToken } = useContext(AppContext)

  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    try{
      const token=await getToken();
      const {data}=axios.get(backendurl+'/api/educator/courses',
        {
          headers:{Authorization:`Bearers ${token}`}
        }
      )
      data.success && setCourses(data.courses);

    }catch(error){
      toast.error(error.message);
    }
  }

  useEffect(() => {
     if(isEducator){
        fetchEducatorCourses()
      }
  }, [isEducator])

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
     <div className='w-full'>
      <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='md:table-auto table-fixed w-full overflow-hidden'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
          <tr>
          <th className='px-4 py-3 font-semibold truncate'>Allcourse</th>
          <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
          <th className='px-4 py-3 font-semibold truncate'>Students</th>
          <th className='px-4 py-3 font-semibold truncate'>Published on</th>
          </tr>
          </thead>
        </table>
      </div>
     </div>
    </div>
  ) : <Loading />
}

export default MyCourses
