"use client";

import { useRouter } from 'next/navigation';




export default function Home() {
  const router = useRouter();
  function handlebutton() {
    
    router.push('/login');
    console.log('button clicked');
  }
  
  
  return (
    <div>
      <h1 className="text-white">Welcome to the Chatroom</h1>
      <div onClick ={handlebutton}className=' text-center  bg-[#f5f5f5] text-black p-2 rounded-lg ease-in-out transition-all duration-300 hover:bg-[#AF8260] hover:shadow-lg'>
    log in
  </div>
    </div>

        
  );
}
