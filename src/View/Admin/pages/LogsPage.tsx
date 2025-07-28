import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import getLogs from '../service/logs/getLogs';
import type { log } from '../type/LogsTypes';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const LogsPage: React.FC = () => {
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState<log | null>(null);
    const [logsData, setLogsData] = useState<log[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const logs = await getLogs(navigate);
            if (logs) {
                // Verileri tarihe göre sırala (en yeni üstte)
                const sortedLogs = [...logs].sort((a, b) =>
                    dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix()
                );
                setLogsData(sortedLogs);
                setLastUpdate(dayjs().format("DD MMMM YYYY, HH:mm"));
            }
            setLoading(false);
        };
        fetchData();
    }, [navigate]);

    const now = dayjs();
    const today = now;
    const yesterday = now.subtract(1, 'day');
    const thisMonth = now;
    const lastMonth = now.subtract(1, 'month');

    const todayLogs = logsData.filter(log => dayjs(log.timestamp).isSame(today, 'day'));
    const yesterdayLogs = logsData.filter(log => dayjs(log.timestamp).isSame(yesterday, 'day'));

    const thisMonthLogs = logsData.filter(log => dayjs(log.timestamp).isSame(thisMonth, 'month'));
    const lastMonthLogs = logsData.filter(log => dayjs(log.timestamp).isSame(lastMonth, 'month'));

    const calculateChange = (current: number, previous: number): string => {
        if (previous === 0) return current === 0 ? "0%" : "∞%";
        const percent = ((current - previous) / previous) * 100;
        const rounded = percent.toFixed(1);
        return `${percent >= 0 ? '+' : ''}${rounded}%`;
    };

    const stats = [
        {
            title: "Toplam Log",
            value: logsData.length,
            change: calculateChange(thisMonthLogs.length, lastMonthLogs.length),
            icon: '📝'
        },
        {
            title: "Bugünkü Loglar",
            value: todayLogs.length,
            change: calculateChange(todayLogs.length, yesterdayLogs.length),
            icon: '🕒'
        },
        {
            title: "Hata Logları",
            value: logsData.filter(log => log.type === 'error').length,
            change: calculateChange(
                thisMonthLogs.filter(log => log.type === 'error').length,
                lastMonthLogs.filter(log => log.type === 'error').length
            ),
            icon: '❌'
        },
        {
            title: "Uyarı Logları",
            value: logsData.filter(log => log.type === 'warning').length,
            change: calculateChange(
                thisMonthLogs.filter(log => log.type === 'warning').length,
                lastMonthLogs.filter(log => log.type === 'warning').length
            ),
            icon: '⚠️'
        }
    ];

    const logTypes = [
        { id: 'all', label: 'Tümü' },
        { id: 'error', label: 'Hatalar' },
        { id: 'warning', label: 'Uyarılar' },
        { id: 'ınformation', label: 'Bilgilendirme' },
        { id: 'debug', label: 'Debug' },
    ];

    const filteredLogs = logsData.filter(log => {
        const typeMatch = selectedType === 'all' || log.type === selectedType;
        const searchMatch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip.toLowerCase().includes(searchTerm.toLowerCase());

        return typeMatch && searchMatch;
    });

    // Sayfalama için hesaplamalar
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

    const getLogTypeColor = (type: string) => {
        switch (type) {
            case 'error': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'ınformation': return 'bg-blue-100 text-blue-800';
            case 'debug': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Sayfa değiştirme fonksiyonu
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Sayfa navigasyonu için butonlar oluştur
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sistem Logları</h1>
                    <div className="mt-2 md:mt-0 text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Son güncelleme: {lastUpdate || "Yükleniyor..."}
                    </div>
                </div>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {loading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))
                        : stats.map((stat, index) => (
                            <StatsCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                change={stat.change}
                                icon={stat.icon}
                            />
                        ))}
                </div>

                {/* Filtreleme ve Arama */}
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {logTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type.id);
                                        setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedType === type.id
                                        ? "bg-indigo-600 text-white shadow-md transform -translate-y-0.5"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Kullanıcı, aksiyon, detay veya IP ara..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Arama değiştiğinde ilk sayfaya dön
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Log Tablosu */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Zaman
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tip
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksiyon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Adresi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Detaylar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading
                                    ? Array.from({ length: 6 }).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            {Array.from({ length: 6 }).map((__, i) => (
                                                <td key={i} className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : currentLogs.length > 0
                                        ? currentLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => setSelectedLog(log)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {dayjs(log.timestamp).format('DD MMM YYYY')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {dayjs(log.timestamp).format('HH:mm:ss')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogTypeColor(
                                                            log.type
                                                        )}`}
                                                    >
                                                        {log.type === "error"
                                                            ? "Hata"
                                                            : log.type === "warning"
                                                                ? "Uyarı"
                                                                : log.type === "ınformation"
                                                                    ? "Bilgi"
                                                                    : "Debug"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{log.user}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {log.action}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                                        {log.details}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                    {log.ip}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                                                        onClick={() => setSelectedLog(log)}
                                                    >
                                                        Detay
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                        : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <h3 className="text-lg font-medium text-gray-700 mb-1">Log bulunamadı</h3>
                                                        <p className="text-gray-500 text-sm">Seçtiğiniz filtrelerle eşleşen log kaydı bulunamadı.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Sayfalama */}
                    {!loading && filteredLogs.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">{indexOfFirstItem + 1}</span> - <span className="font-medium">
                                            {Math.min(indexOfLastItem, filteredLogs.length)}
                                        </span> arası gösteriliyor (Toplam <span className="font-medium">{filteredLogs.length}</span> log)
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${currentPage === 1
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Önceki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {renderPageNumbers()}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Sonraki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Log Detay Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Log Detayları</h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Zaman Damgası</h4>
                                    <p className="mt-1 text-lg font-medium text-gray-900">
                                        {dayjs(selectedLog.timestamp).format('DD MMMM YYYY, HH:mm:ss')}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Log Tipi</h4>
                                    <p className="mt-1">
                                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getLogTypeColor(selectedLog.type)}`}>
                                            {selectedLog.type === 'error' ? 'Hata' :
                                                selectedLog.type === 'warning' ? 'Uyarı' :
                                                    selectedLog.type === 'ınformation' ? 'Bilgi' : 'Debug'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Kullanıcı</h4>
                                    <p className="mt-1 text-lg font-medium text-gray-900">{selectedLog.user}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">IP Adresi</h4>
                                    <p className="mt-1 text-lg font-mono text-gray-900">{selectedLog.ip}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500">Aksiyon</h4>
                                <p className="mt-1 text-lg font-medium text-gray-900">{selectedLog.action}</p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500">Detaylar</h4>
                                <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                                        {selectedLog.details}
                                    </pre>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Ham Log Verisi</h4>
                                <pre className="text-xs text-gray-600 bg-white p-3 rounded overflow-auto max-h-40 font-mono">
                                    {JSON.stringify(selectedLog, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setSelectedLog(null)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogsPage;