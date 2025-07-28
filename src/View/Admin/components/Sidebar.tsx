import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ChartBarIcon,
    PhotoIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon// 🆕 Eklenen ikon
} from '@heroicons/react/24/outline';
interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const navigation = [
        { name: 'Dashboard', href: '/adminpage', icon: ChartBarIcon },
        { name: 'Arka Planlar', href: '/adminpage/backgrounds', icon: PhotoIcon },
        { name: 'Şikayetler', href: '/adminpage/complaints', icon: ExclamationTriangleIcon },
        { name: 'Kullanıcılar', href: '/adminpage/users', icon: UserGroupIcon },
        { name: "Loglar", href: "/adminpage/logs", icon: DocumentTextIcon },];
    const navigate = useNavigate();


    return (
        <>
            {/* Mobile sidebar overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Admin Panel</span>
                    </div>
                </div>

                <nav className="mt-5 px-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 mt-1 rounded-md ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                            <span className="text-sm font-medium">{item.name}</span>
                        </NavLink>
                    ))}

                    <button
                        className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md mt-3.5"
                        onClick={() => navigate('/messenger')}
                    >
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                        <span className="text-sm font-medium">Sohbet Ekranına Dön</span>
                    </button>

                </nav>
            </div>
        </>
    );
};

export default Sidebar;