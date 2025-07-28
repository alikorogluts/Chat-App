import React, { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobil URL</label>
                        <input
                            type="text"
                            value={newMobileUrl}
                            onChange={(e) => setNewMobileUrl(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Mobil URL girin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Web URL</label>
                        <input
                            type="text"
                            value={newWebUrl}
                            onChange={(e) => setNewWebUrl(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Web URL girin"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={handleClear}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Temizle
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Kaydet
                    </button>
                </div>
            </div>

            {/* Yönetim Tablosu */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
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
                        {loading
                            ? Array(4)
                                .fill(0)
                                .map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton /></td>
                                        <td className="px-6 py-4"><Skeleton width={250} /></td>
                                        <td className="px-6 py-4"><Skeleton width={250} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} /></td>
                                    </tr>
                                ))
                            : backgrounds.map((bg) => (
                                <tr key={bg.imageId}>
                                    <td className="px-6 py-4 text-sm text-gray-500">{bg.imageId}</td>
                                    <td className="px-6 py-4">
                                        {editingId === bg.imageId ? (
                                            <input
                                                type="text"
                                                value={tempData?.mobileUrl || ''}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData!, mobileUrl: e.target.value })
                                                }
                                                className="border rounded p-2 w-full"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-900 truncate block max-w-xs">{bg.mobileUrl}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === bg.imageId ? (
                                            <input
                                                type="text"
                                                value={tempData?.webUrl || ''}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData!, webUrl: e.target.value })
                                                }
                                                className="border rounded p-2 w-full"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-900 truncate block max-w-xs">{bg.webUrl}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {editingId === bg.imageId ? (
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleSave(bg.imageId)} className="text-green-600 hover:text-green-900">
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={handleCancel} className="text-red-600 hover:text-red-900">
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEdit(bg.imageId, bg.mobileUrl, bg.webUrl)} className="text-blue-600 hover:text-blue-900">
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDelete(bg.imageId)} className="text-red-600 hover:text-red-900">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Backgrounds;
