import React from 'react';

interface StatsCardProps {
    title: string;
    value: number;
    change: string;
    icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                    <p className="text-xs text-green-500 mt-1">{change} geçen aya göre</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;