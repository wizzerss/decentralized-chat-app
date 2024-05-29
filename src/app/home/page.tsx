"use client";
import { useState, useEffect } from 'react';
import { useDisconnect, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { useRouter } from 'next/navigation';
import ContractABI from '../../../abi.json';
import Layout from './layout';

const Home = () => {
  const [chat, setChat] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState<{ username: string; message: string; }[]>([]);
  
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const contractAddress = process.env.ContractAddress as `0x${string}` | undefined;;

  const { data: allChats, isError: isReadError, isLoading: isReadLoading } = useReadContract({
    address: contractAddress,
    abi: ContractABI,
    functionName: 'getAllChats',
    args: [],
  });

  const { data: userData, isError: isUserError, isLoading: isUserLoading } = useReadContract({
    address: contractAddress,
    abi: ContractABI,
    functionName: 'get_username',
    args: [localStorage.getItem('pass_address')],
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (allChats && Array.isArray(allChats)) {
      setMessages(allChats.map(chat => ({ username: chat.username, message: chat.message })));
    }
  }, [allChats]);

  useEffect(() => {
    if (userData) {
      setUsername(userData);
    }
  }, [userData]);

  useWatchContractEvent({
    address: contractAddress,
    abi: ContractABI,
    eventName: 'NewChatAdded',
    onLogs: (logs) => {
      console.log('New logs!', logs);
      const newMessage = {
        username: logs[0].args.username,
        message: logs[0].args.message
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    },
  });
  useEffect(() => {
    const storedName = localStorage.getItem('pass_address');
    if (storedName) {
      setName(storedName);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleDisconnect = () => {
    console.log('Disconnect button clicked');
    localStorage.removeItem('pass_address');
    setName('');
    disconnect();
    router.push('/login');
  };

  const handleSend = async () => {
    await writeContract({
      address: contractAddress,
      abi: ContractABI,
      functionName: 'addChat',
      args: [username, chat],
    });
    console.log("Message sent");
    setChat('');
  };

  return (
    <Layout>
      <div className='absolute bottom-7'>
        {messages.map(({ username: usr, message }, index) => (
          <div key={index} className={`flex ${usr === username ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`rounded p-2 ${usr === username ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              <p>{usr}: {message}</p>
            </div>
          </div>
        ))}
        <input
          type='text'
          className='w-[1500px] h-[40px] rounded'
          value={chat}
          onChange={(e) => setChat(e.target.value)}
        />
        <button
          className='ml-[100px] bg-[#D9D9D9] py-2 px-4 rounded hover:bg-[#F6B17A]'
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </Layout>
  );
};

export default Home;
