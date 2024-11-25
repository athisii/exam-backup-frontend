import React, { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { IRHData } from '@/types/types';
import { fetchRegions } from '@/app/admin/rh-user/actions'; 

interface RoleProps {
  role: IRHData;
  index: number;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
  changeSelectedRole: Dispatch<SetStateAction<IRHData>>;
}

const RegionHead = ({
  role,
  index,
  changeSelectedRole,
  setShowEditModal,
  setShowDeleteModal,
}: RoleProps) => {
  const [regionName, setRegionName] = useState<string>('No Region');
  const [regions, setRegions] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const response = await fetchRegions();
        setRegions(response.data); 
      } catch (err) {
        setError('Failed to fetch regions');
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []); 

  
  useEffect(() => {
    if (role.regionId) {
      const region = regions.find((region) => region.id === role.regionId);
      if (region) {
        setRegionName(region.name); 
      }
    }
  }, [regions, role.regionId]); 

  const roleName = role.isRegionHead ? 'Region Head' : 'Admin';
  const createdDate = role.createdDate ? new Date(role.createdDate).toLocaleDateString() : 'N/A';
  const modifiedDate = role.modifiedDate ? new Date(role.modifiedDate).toLocaleDateString() : 'N/A';

  const handleEditClick = () => {
    changeSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    changeSelectedRole(role);
    setShowDeleteModal(true);
  };

  return (
    <tr key={role.id} className="border-1 hover:bg-gray-100">
      <td className="px-6 py-4 text-center">{index}</td>
      <td className="px-6 py-4">{role.name || 'N/A'}</td>
      <td className="px-6 py-4 text-center">{role.userId}</td>
      <td className="px-6 py-4 text-center">{roleName}</td>
      <td className="px-6 py-4 text-center">
        {loading ? 'Loading regions...' : error ? error : regionName} 
        {/* Display loading or error message */}
      </td>
      <td className="px-6 py-4 text-center">{createdDate}</td>
      <td className="px-6 py-4 text-center">{modifiedDate}</td>

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
            viewBox="0 0 24 24"
          >
            <path
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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

export default RegionHead;
