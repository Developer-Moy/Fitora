import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;