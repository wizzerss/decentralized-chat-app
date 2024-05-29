"use client";
import { useReadContract ,useWriteContract } from 'wagmi';
import ContractABI from '../../../abi.json';
import React, {useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import Layout from './layout';
import { config, projectId } from '../../../config';








const User=()=>{

  
  const { data: hash, writeContract } = useWriteContract();


  const [isSubmitted, setIsSubmitted] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  const contractAddress = process.env.ContractAddress;

  const { data, isError, isLoading } = useReadContract({
  address: contractAddress,
  abi: ContractABI,
  functionName: 'get_username',
  args: [address], // Replace '0xtest' with a valid address as needed
});


const [username, setUsername] = useState('');

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setUsername(event.target.value);
};

const handlebutton = (event:any) => {
  event.preventDefault();
  console.log(username);
 
  writeContract({
    address: contractAddress,
    abi: ContractABI,
    functionName: 'add_new_user',
    args: [address, username],
  })
  console.log("hash:",hash)

  setIsSubmitted(true);

}

console.log('data',data);


if(data){
  const user_name=data;
  console.log('name',user_name);
  return (
    <App/>



  );
}else
{return (
  <div style={{ padding: '20px' }}>
  <div className='mt-5 ml-4'>
    <input
      type="text"
      placeholder="Enter your User name"
      value={username}
      onChange={handleInputChange}
      style={{
        padding: '10px',
        fontSize: '16px',
        color: 'black',
        borderRadius: '5px',
        border: '1px solid #ccc'
      }}
    />
  </div>
  
  <div onClick ={handlebutton}className='  text-center mt-5 ml-4 bg-[#f5f5f5] text-black p-2 rounded-lg ease-in-out transition-all duration-300 hover:bg-[#AF8260] hover:shadow-lg'>
    Submit
  </div>
  {isSubmitted && <App />}
</div>
)

}

}

const App = () => {
  console.log('App')
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting) return;
    if (isDisconnected) return;
    if (address) {
      localStorage.setItem('pass_address', address);
      const check_address = localStorage.getItem('pass_address');
      if (check_address) {
        router.push('/home');
      }
    }
  }, [address, isConnecting, isDisconnected, router]);
  if (isConnecting) return <div>Connecting… {address}</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return null;
};

export default function Login() {
 // const [isWeb3ModalCreated, setIsWeb3ModalCreated] = useState(false);

useEffect(() => {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
  });
 
}, []);


  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const handleConnect =  () => {
     open();
  };

  const handleDisconnect = () => {
    console.log('Disconnect button clicked');
    disconnect();
  };
  return (
    <Layout>
      <h1 className='text-white'>Connect with your MetaMask wallet to enter the chat</h1>
      <button
        className="  text-center mt-5 bg-[#f5f5f5] text-black p-2 rounded-lg ease-in-out transition-all duration-300 hover:bg-[#AF8260] hover:shadow-lg"
        onClick={handleConnect}
      >
        Connect
      </button>
      <button
        className="mt-5 bg-[#f5f5f5] text-black p-2 rounded-lg"
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
      <User/> 
     
    </Layout>
  );
}
