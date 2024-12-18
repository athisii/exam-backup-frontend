import React, {Dispatch, SetStateAction} from 'react';
import {IRegion, IRole, IUser} from '@/types/types';

interface UserProps {
    user: IUser;
    index: number;
    setShowEditModal: Dispatch<SetStateAction<boolean>>;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
    changeSelectedRole: Dispatch<SetStateAction<IUser>>;
    regions: IRegion[];
    roles: IRole[];
}

const User = ({
                  user,
                  index,
                  changeSelectedRole,
                  setShowEditModal,
                  setShowDeleteModal,
                  regions,
                  roles,
              }: UserProps) => {

    const region = regions.find(region => region.id === user.regionId);
    const role = roles.find(role => role.id === user.roleId);
    if (!role) {
        throw new Error("No role found for the user.");
    }

    const handleEditClick = () => {
        changeSelectedRole(user);
        setShowEditModal(true);
    };

    const handleDeleteClick = () => {
        changeSelectedRole(user);
        setShowDeleteModal(true);
    };

    return (
        <tr key={user.id} className="border-1 hover:bg-gray-100">
            <td className="px-6 py-4 text-center">{index}</td>
            <td className="px-6 py-4">{user.name || 'N/A'}</td>
            <td className="px-6 py-4 text-center">{user.userId}</td>
            <td className="px-6 py-4 text-center">{role.name}</td>
            <td className="px-6 py-4 text-center">{region ? region.name : "No Region"}</td>
            <td className="px-6 py-4 text-center">{user.createdDate}</td>
            <td className="px-6 py-4 text-center">{user.modifiedDate}</td>
            <td className="px-9 py-4 text-center">
                <button
                    className={`py-2 rounded-md text-white active:bg-green-300`}
                    onClick={handleEditClick}
                >
                    <svg
                        className="w-6 h-6 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                    </svg>
                </button>
            </td>

            <td className="px-9 py-4 text-center">
                <button
                    className={`py-2 px-3 text-white rounded-md active:bg-red-300`}
                    onClick={handleDeleteClick}
                >
                    <svg
                        className="w-6 h-6 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="red"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default User;
