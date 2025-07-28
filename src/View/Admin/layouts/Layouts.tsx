import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Sidebar from '../components/Sidebar';

interface LayoutProps {
    isAdmin: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isAdmin }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/", { replace: true }); // Admin değilse anasayfaya yönlendir
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) {
        // Admin değilse yönlendirme yapılana kadar boş göster
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 w-full">
                <AppBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="h-full overflow-y-auto p-4 md:p-6">
                    <div className="container mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
