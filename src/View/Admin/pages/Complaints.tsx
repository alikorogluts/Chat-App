import React, { useState, useEffect } from 'react';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import getComplaints from '../service/complaints/getComplaints';
import type { Complaint } from '../type/ComplaintsTypes';
import { complaintStatusText } from '../type/ComplaintsTypes';
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../../connection';
import updateComplaintStatus from '../service/complaints/updateComplaints';
import deleteComplaint from '../service/complaints/deleteComplaints';

const Complaints: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [updatedStatus, setUpdatedStatus] = useState<string | null>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getComplaints(navigate);
            if (data && data.complaints) {
                setComplaints(data.complaints);
            }
            setLoading(false);
        };

        fetchData();
    }, [navigate]);

    const handleRowClick = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setUpdatedStatus(complaint.status);
    };

    const handleImagePreviewToggle = () => {
        setIsImagePreviewOpen(prev => !prev);
    };

    const handleSaveStatus = async () => {
        if (!selectedComplaint || !updatedStatus) return;

        const statusMap: Record<string, number> = {
            Pending: 0,
            InProgress: 1,
            Resolved: 2
        };

        const result = await updateComplaintStatus(
            selectedComplaint.id,
            statusMap[updatedStatus],
            navigate
        );

        if (result && result.success) {
            setComplaints(prev =>
                prev.map(item =>
                    item.id === selectedComplaint.id ? { ...item, status: updatedStatus as Complaint['status'] } : item
                )
            );
            setSelectedComplaint(null);
        }
    };

    const handleDelete = async (complaintId: number) => {
        const result = await deleteComplaint(complaintId, navigate);

        if (result && result.success) {
            setComplaints(prev => prev.filter(c => c.id !== complaintId));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">Şikayetler</h1>

            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{selectedComplaint.title}</h2>
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">{selectedComplaint.description || "Açıklama bulunamadı."}</p>

                            {selectedComplaint.image && (
                                <>
                                    <div className="mb-4 cursor-pointer" onClick={handleImagePreviewToggle}>
                                        <img
                                            src={apiConfig.connectionString + selectedComplaint.image}
                                            alt="Şikayet görseli"
                                            className="max-w-full h-auto rounded-md hover:shadow-lg transition duration-200"
                                        />
                                    </div>

                                    {isImagePreviewOpen && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                                            onClick={handleImagePreviewToggle}
                                        >
                                            <img
                                                src={apiConfig.connectionString + selectedComplaint.image}
                                                alt="Tam ekran şikayet görseli"
                                                className="max-w-screen-lg max-h-screen rounded-lg"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">🔑 Kullanıcı ID</p>
                                    <p className="text-gray-800">{selectedComplaint.userId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">📅 Tarih</p>
                                    <p className="text-gray-800">
                                        {new Date(selectedComplaint.date).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">📌 Durum</p>
                                    <select
                                        value={updatedStatus ?? selectedComplaint.status}
                                        onChange={(e) => setUpdatedStatus(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                    >
                                        <option value="Pending">Beklemede</option>
                                        <option value="InProgress">İşlemde</option>
                                        <option value="Resolved">Çözüldü</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Kapat
                                </button>
                                <button
                                    onClick={handleSaveStatus}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {Array.from({ length: 6 }).map((__, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-full max-w-xs"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            complaints.map(complaint => (
                                <tr
                                    key={complaint.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(complaint)}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-500">{complaint.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{complaint.userId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{complaint.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                                            ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    'bg-blue-100 text-blue-800'}`}
                                        >
                                            {complaintStatusText[complaint.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(complaint.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(complaint);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(complaint.id);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Complaints;