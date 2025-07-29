import React, { useEffect, useState } from 'react';
import { LockClosedIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';
import getUsers from '../service/users/getUsers';
import { useNavigate } from 'react-router-dom';
import type { _user, userRoles } from '../type/UsersTypes';
import { isSuspendedText } from '../type/UsersTypes';
import updateSuspendUser from '../service/users/suspendUser';
import updateUserRole from '../service/users/updateUserRole';

const Users: React.FC = () => {
    const [users, setUsers] = useState<_user[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        _getUsers();
    }, []);

    const _getUsers = async () => {
        setLoading(true);
        try {
            const result = await getUsers(navigate);
            if (result && result.users) {
                setUsers(result.users);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleToggleStatus = async (userId: number) => {
        try {
            const result = await updateSuspendUser(userId, navigate);
            if (result && result.success) {
                setUsers(prev =>
                    prev.map(user =>
                        user.userId === userId
                            ? { ...user, isSuspended: !user.isSuspended }
                            : user
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeRole = async (userId: number, newRole: userRoles) => {
        try {
            const result = await updateUserRole(userId, newRole, navigate);
            if (result && result.success) {
                setUsers(prev =>
                    prev.map(user =>
                        user.userId === userId
                            ? { ...user, userRole: newRole }
                            : user
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = (id: number) => {
        toast.error("Şu an silme işlemi devre dışı" + id);
    };

    const filteredUsers = users.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>

                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Kullanıcı ara..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={_getUsers}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        <span className="hidden md:inline">Yenile</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Masaüstü Tablo */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı Adı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yetki</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton width={30} height={30} /></td>
                                        <td className="px-6 py-4"><Skeleton width={120} height={30} /></td>
                                        <td className="px-6 py-4"><Skeleton width={180} height={30} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} height={30} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} height={30} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} height={30} /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Kullanıcı bulunamadı
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.userId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                                                {user.userName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <select
                                                value={user.userRole}
                                                onChange={(e) => handleChangeRole(user.userId, Number(e.target.value) as userRoles)}
                                                className="border rounded-md p-1.5 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value={1}>Admin</option>
                                                <option value={0}>Kullanıcı</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(user.userId)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${!user.isSuspended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {isSuspendedText[`${user.isSuspended}`]}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleToggleStatus(user.userId)}
                                                    className="p-1.5 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                                                    title={user.isSuspended ? 'Engeli Kaldır' : 'Engelle'}
                                                >
                                                    <LockClosedIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.userId)}
                                                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                    title="Sil"
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

                {/* Mobil Liste */}
                <div className="md:hidden">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 border-b">
                                <div className="flex justify-between items-center mb-2">
                                    <Skeleton width={120} height={25} />
                                    <Skeleton width={80} height={25} />
                                </div>
                                <Skeleton width={200} height={20} />
                                <div className="flex gap-2 mt-3">
                                    <Skeleton width={80} height={30} />
                                    <Skeleton width={30} height={30} />
                                    <Skeleton width={30} height={30} />
                                </div>
                            </div>
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Kullanıcı bulunamadı
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <div key={user.userId} className="p-4 border-b hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.userName}</h3>
                                            <p className="text-sm text-gray-500">ID: {user.userId}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                                        ${!user.isSuspended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isSuspendedText[`${user.isSuspended}`]}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-3 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user.email}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <select
                                        value={user.userRole}
                                        onChange={(e) => handleChangeRole(user.userId, Number(e.target.value) as userRoles)}
                                        className="border rounded-md p-1.5 bg-white text-sm flex-1 min-w-[120px]"
                                    >
                                        <option value={1}>Admin</option>
                                        <option value={0}>Kullanıcı</option>
                                    </select>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(user.userId)}
                                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                                            title={user.isSuspended ? 'Engeli Kaldır' : 'Engelle'}
                                        >
                                            <LockClosedIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.userId)}
                                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                            title="Sil"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
                Toplam {filteredUsers.length} kullanıcı listeleniyor
            </div>
        </div>
    );
};

export default Users;