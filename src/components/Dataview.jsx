import React from 'react'
// import './Dataview.css'

const Dataview = ({data}) => {
  return (
<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700" style={{position: 'fixed', top: "0", right:"20px"}}>
    
    <div className="flex flex-col items-center pb-10">
        {/* <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image"/> */}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.email}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.location}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.about}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.phone}</span>
        
    </div>
</div>

  )
}

export default Dataview