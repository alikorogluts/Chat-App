import React, { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon, ClipboardIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Slideshow from '../components/Slideshow';
import getBackgroundImages from '../service/backgrouns/getBackgrounds';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import updateBackground from '../service/backgrouns/updateBackgrounds';
import addBackground from '../service/backgrouns/addBackgounds';
import deleteBackground from '../service/backgrouns/deleteBackgrounds';

interface Background {
    imageId: number;
    mobileUrl: string;
    webUrl: string;
}

const Backgrounds: React.FC = () => {
    const [backgrounds, setBackgrounds] = useState<Background[]>([]);
    const [loading, setLoading] = useState(true);

    const [newMobileUrl, setNewMobileUrl] = useState('');
    const [newWebUrl, setNewWebUrl] = useState('');

    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempData, setTempData] = useState<{ mobileUrl: string; webUrl: string } | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            const result = await getBackgroundImages(navigate);
            if (result && result.images) {
                setBackgrounds(result.images);
            }
            setLoading(false);
        };

        fetchImages();
    }, [navigate]);

    const handleAddNew = async () => {
        if (!newMobileUrl || !newWebUrl) return;

        const result = await addBackground(newMobileUrl, newWebUrl, navigate);
        if (result && result.success === true && result.id) {
            const newBg: Background = {
                imageId: result.id,
                mobileUrl: newMobileUrl,
                webUrl: newWebUrl,
            };

            setBackgrounds([newBg, ...backgrounds]);
            setNewMobileUrl('');
            setNewWebUrl('');
        }
    };

    const handleEdit = (id: number, mobileUrl: string, webUrl: string) => {
        setEditingId(id);
        setTempData({ mobileUrl, webUrl });
    };

    const handleSave = async (id: number) => {
        if (!tempData) return;

        const result = await updateBackground(id, tempData.mobileUrl, tempData.webUrl, navigate);
        if (result && result.success === true) {
            setBackgrounds((prev) =>
                prev.map((bg) => (bg.imageId === id ? { ...bg, ...tempData } : bg))
            );
            setEditingId(null);
            setTempData(null);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setTempData(null);
    };

    const handleDelete = async (id: number) => {
        const result = await deleteBackground(id, navigate);
        if (result && result.success === true) {
            setBackgrounds(backgrounds.filter((bg) => bg.imageId !== id));
        }
    };

    const handleClear = () => {
        setNewMobileUrl('');
        setNewWebUrl('');
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Arka Plan Resimleri</h1>

            {/* Slayt Gösterisi */}
            {loading ? (
                <div className="h-96">
                    <Skeleton
                        variant="rectangular"
                        height="200px"
                        width="100%"
                        sx={{ borderRadius: 8 }}
                    />
                </div>
            ) : (
                <Slideshow images={backgrounds} />
            )}

            {/* Yeni Ekleme Formu */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Yeni Arka Plan Ekle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobil URL</label>
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                📱
                            </span>
                            <input
                                type="text"
                                value={newMobileUrl}
                                onChange={(e) => setNewMobileUrl(e.target.value)}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="https://example.com/mobile.jpg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Web URL</label>
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                🖥️
                            </span>
                            <input
                                type="text"
                                value={newWebUrl}
                                onChange={(e) => setNewWebUrl(e.target.value)}
                                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="https://example.com/web.jpg"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={handleClear}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Temizle
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Kaydet
                    </button>
                </div>
            </div>

            {/* Yönetim Tablosu - Masaüstü Görünüm */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobil URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Web URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton /></td>
                                    <td className="px-6 py-4"><Skeleton width={250} /></td>
                                    <td className="px-6 py-4"><Skeleton width={250} /></td>
                                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                                </tr>
                            ))
                        ) : (
                            backgrounds.map((bg) => (
                                <tr key={bg.imageId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">{bg.imageId}</td>
                                    <td className="px-6 py-4">
                                        {editingId === bg.imageId ? (
                                            <div className="flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    value={tempData?.mobileUrl || ''}
                                                    onChange={(e) => setTempData({ ...tempData!, mobileUrl: e.target.value })}
                                                    className="flex-1 block w-full rounded-md border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-900 truncate max-w-xs">{bg.mobileUrl}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(bg.mobileUrl)}
                                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                                    title="Kopyala"
                                                >
                                                    <ClipboardIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === bg.imageId ? (
                                            <div className="flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    value={tempData?.webUrl || ''}
                                                    onChange={(e) => setTempData({ ...tempData!, webUrl: e.target.value })}
                                                    className="flex-1 block w-full rounded-md border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-900 truncate max-w-xs">{bg.webUrl}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(bg.webUrl)}
                                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                                    title="Kopyala"
                                                >
                                                    <ClipboardIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {editingId === bg.imageId ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleSave(bg.imageId)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
                                                    title="Kaydet"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                                    title="İptal"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(bg.imageId, bg.mobileUrl, bg.webUrl)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                                                    title="Düzenle"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bg.imageId)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                                    title="Sil"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobil Kart Görünümü */}
            <div className="md:hidden mt-6 space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <Skeleton variant="rectangular" height={30} />
                            <div className="mt-3 space-y-2">
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="60%" />
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <Skeleton variant="circular" width={30} height={30} />
                                <Skeleton variant="circular" width={30} height={30} />
                            </div>
                        </div>
                    ))
                ) : (
                    backgrounds.map((bg) => (
                        <div key={bg.imageId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-800">ID: {bg.imageId}</h3>
                                {editingId === bg.imageId ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleSave(bg.imageId)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                                            title="Kaydet"
                                        >
                                            <CheckIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                            title="İptal"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(bg.imageId, bg.mobileUrl, bg.webUrl)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                                            title="Düzenle"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bg.imageId)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                            title="Sil"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Mobil URL</label>
                                    {editingId === bg.imageId ? (
                                        <input
                                            type="text"
                                            value={tempData?.mobileUrl || ''}
                                            onChange={(e) => setTempData({ ...tempData!, mobileUrl: e.target.value })}
                                            className="w-full p-2 border rounded-md text-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                            <span className="text-sm text-gray-700 truncate">{bg.mobileUrl}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(bg.mobileUrl)}
                                                className="text-gray-400 hover:text-gray-600 ml-2"
                                                title="Kopyala"
                                            >
                                                <ClipboardIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Web URL</label>
                                    {editingId === bg.imageId ? (
                                        <input
                                            type="text"
                                            value={tempData?.webUrl || ''}
                                            onChange={(e) => setTempData({ ...tempData!, webUrl: e.target.value })}
                                            className="w-full p-2 border rounded-md text-sm"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                            <span className="text-sm text-gray-700 truncate">{bg.webUrl}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(bg.webUrl)}
                                                className="text-gray-400 hover:text-gray-600 ml-2"
                                                title="Kopyala"
                                            >
                                                <ClipboardIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Backgrounds;
