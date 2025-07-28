import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { IconButton } from '@mui/material';
import { ComputerIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppBarProps {
    toggleSidebar: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <button
                        type="button"
                        className="text-gray-500 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <h1 className="ml-3 text-lg font-medium text-gray-800">Admin Panel</h1>
                </div>
                <div className="flex items-center">
                    <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <IconButton
                            onClick={() => navigate("/messenger")} // küçük harf kullanımı önerilir
                            color="inherit"
                            size="large"
                            sx={{ mr: 1 }}
                            aria-label="Sohbet ekranına geç"
                        >
                            <ComputerIcon />
                        </IconButton>
                    </button>

                </div>
            </div>
        </header>
    );
};

export default AppBar;