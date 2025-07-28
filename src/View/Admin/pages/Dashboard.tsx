import React, { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import getDashboard from '../service/dashboard/getDashboard';
import { useNavigate } from 'react-router-dom';
import type { Stat, MonthlyComplaint } from '../type/DashboardTypes';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stat[]>([]);
    const [monthlyComplaints, setMonthlyComplaints] = useState<MonthlyComplaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getDashboard(navigate);
            if (data) {
                setStats(data.stats);
                setMonthlyComplaints(data.monthlyComplaints);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [navigate]);

    const columns = [
        { Header: 'Ay', accessor: 'month' },
        { Header: 'Şikayet Sayısı', accessor: 'count' },
    ];

    return (
        <div>
            {/* Başlık */}
            {isLoading ? (
                <Skeleton variant="text" width={250} height={36} />
            ) : (
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Dashboard</h1>
            )}

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-4">
                            <Skeleton variant="text" width={100} height={30} />
                            <Skeleton variant="text" width={60} height={20} />
                            <Skeleton variant="circular" width={40} height={40} />
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            change={stat.change}
                            icon={stat.icon}
                        />
                    ))
                )}
            </div>

            {/* Aylık Şikayet Tablosu */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Aylık Toplam Şikayetler</h2>
                {isLoading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={40} />
                        ))}
                    </div>
                ) : (
                    <Table columns={columns} data={monthlyComplaints} className="w-full" />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
