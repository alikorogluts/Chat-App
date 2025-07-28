import React, { useEffect, useState } from 'react';
import { LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
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
    const navigate = useNavigate();

    useEffect(() => {
        _getUsers();
    }, []);

    const _getUsers = async () => {
        setLoading(true);
        const result = await getUsers(navigate);
        if (result && result.users) {
            setUsers(result.users);
        }
        setLoading(false);
    };

    const handleToggleStatus = async (userId: number) => {
        const result = await updateSuspendUser(userId, navigate);
        if (result && result.success == true) {

            setUsers(prev =>
                prev.map(user =>
                    user.userId === userId
                        ? { ...user, isSuspended: !user.isSuspended }
                        : user
                )
            );
        }

    };

    const handleChangeRole = async (userId: number, newRole: userRoles) => {
        const result = await updateUserRole(userId, newRole, navigate);
        if (result && result.success == true) {

            setUsers(prev =>
                prev.map(user =>
                    user.userId === userId
                        ? { ...user, userRole: newRole }
                        : user
                )
            );
        }
    };


    const handleDeleteUser = (id: number) => {
        toast.error("Şu an silme işlemi devre dışı" + id);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">Kullanıcılar</h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı Adı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yetki</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksiyonlar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton width={30} /></td>
                                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                                    <td className="px-6 py-4"><Skeleton width={90} /></td>
                                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                                </tr>
                            ))
                        ) : (
                            users.map(user => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.userId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.userName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <select
                                            value={user.userRole}
                                            onChange={(e) => handleChangeRole(user.userId, Number(e.target.value) as userRoles)}
                                            className="border rounded p-1 bg-white"
                                        >
                                            <option value={1}>Admin</option>
                                            <option value={0}>Kullanıcı</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user.userId)}
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${!user.isSuspended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {isSuspendedText[`${user.isSuspended}`]}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleToggleStatus(user.userId)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                                title={user.isSuspended ? 'Engeli Kaldır' : 'Engelle'}
                                            >
                                                <LockClosedIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.userId)}
                                                className="text-red-600 hover:text-red-900"
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
        </div>
    );
};

export default Users;
