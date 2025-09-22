import React from 'react'
import Chat from '@/components/chat/chatbox'
const page = ({params}) => {
    const {agent} = params;
  return (
   <Chat agent={agent}/>
  )
}

export default page
