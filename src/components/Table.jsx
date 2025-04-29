import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useUserStore } from "./zustand/userStore";

const Table = ({
  headers,
  // loading,
  data,
  onUserClick,
  onStatusToggle,
  onDelete,
  onUpdate,
}) => {
  // const statusId = useSelector((state) => state.users.updatingUserId);
  const { updatingUserId,loading, childLoading } = useUserStore();
  const statusId = updatingUserId;
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  // console.log(statusId, "status Id");

  const toggleDropdown = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers?.map((header, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider text-left cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
                  header.name.toLowerCase() === "email"
                    ? "hidden md:table-cell"
                    : ""
                }`}
              >
                {header.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 && loading ? (
            <>
              <SkeletonRow columns={headers.length} />
              <SkeletonRow columns={headers.length} />
              <SkeletonRow columns={headers.length} />
            </>
          ) : (
            data?.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {Object.entries(item).map(([key, value], idx) => {
                  const isEmail = key.toLowerCase() === "email";
                  const isClickableObj =
                    typeof value === "object" && value?.onclick;
                  const isStatusButton = value?.isStatusButton;
                  const isActions = value?.isActions;

                  return (
                    <td
                      key={idx}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${
                        isEmail ? "hidden md:table-cell" : ""
                      } ${
                        isClickableObj && !isStatusButton && !isActions
                          ? "cursor-pointer"
                          : ""
                      }`}
                      onClick={
                        isClickableObj && !isStatusButton && !isActions
                          ? () => onUserClick?.(value.id)
                          : undefined
                      }
                    >
                      {isStatusButton ? (
                        <div className="relative w-12 h-6 flex items-center justify-center">
                          {statusId === value.id ? (
                            <div className="flex items-center justify-center w-6 h-6">
                              <div className="animate-spin border-2 border-t-transparent border-gray-500 rounded-full w-4 h-4" />
                            </div>
                          ) : (
                            <label className="relative inline-block w-12 h-6">
                              <input
                                type="checkbox"
                                checked={value.checked}
                                onChange={() =>
                                  onStatusToggle(value.id, !value.checked)
                                }
                                className="sr-only peer"
                              />
                              {/* Track */}
                              <div
                                className={`absolute top-0 left-0 w-full h-full rounded-full transition-colors duration-300 ${
                                  value.checked
                                    ? "bg-green-500 peer-checked:bg-green-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              />
                              {/* Knob */}
                              <div
                                className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  value.checked
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              />
                            </label>
                          )}
                        </div>
                      ) : isActions ? (
                        <>
                          {/* Inline buttons for medium and larger screens */}
                          <div className="hidden md:flex gap-2">
                            <button
                              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                              onClick={() => onUpdate?.(value.id)}
                            >
                              <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Update
                              </span>
                            </button>
                            <button
                              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                              onClick={() => onDelete?.(value.id)}
                            >
                              <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Delete
                              </span>
                            </button>
                          </div>

                          {/* Dropdown menu for small screens */}
                          <div className="md:hidden relative inline-block">
                            <button
                              className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                              onClick={() => toggleDropdown(index)}
                            >
                              <FiMoreVertical size={20} />
                            </button>
                            {isDropdownOpen === index && (
                              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-10">
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                  <li
                                    onClick={() => {
                                      onUpdate?.(value.id);
                                      setIsDropdownOpen(null);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                  >
                                    Update
                                  </li>
                                  <li
                                    onClick={() => {
                                      onDelete?.(value.id);
                                      setIsDropdownOpen(null);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                  >
                                    Delete
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </>
                      ) : typeof value === "object" ? (
                        value?.text
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
