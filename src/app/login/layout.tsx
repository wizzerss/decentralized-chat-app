import React from 'react';
import Web3ModalProvider from '../../../context'
import { cookieToInitialState } from 'wagmi'
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
    <Web3ModalProvider >
    <div className="flex h-[100vh] w-[100vw] bg-[#252323] justify-center items-center">
      <div className="flex flex-col justify-center items-center m-auto">
        {children}
      </div>
    </div>
    </Web3ModalProvider></div>
  );
};

export default Layout;