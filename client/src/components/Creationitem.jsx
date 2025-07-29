import React, { useState } from 'react'
import Markdown from 'react-markdown'


const Creationitem = ({item}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div  className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200'>
      <div onClick={() => setExpanded(!expanded)} className='flex items-center justify-between gap-4'>
        <div>
          <h2>{item.prompt}</h2>
          <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-4 py-2 rounded-full'>{item.type}</button>
      </div>
      {
        expanded && (
          <div>
            {item.type === 'image' ?  (
              <div> 
                <img src={item.content} alt="image" className='mt-3 w-full max-w-md' />
              </div>
            ): (
              <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                <div className='reset-tw'>
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

export default Creationitem