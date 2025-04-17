import React from "react";
import SkeletonRow from "./SkeletonRow";
import { useSelector } from "react-redux";

const Table = ({
  headers,
  loading,
  data,
  onUserClick,
  onStatusToggle,
  onDelete,
  onUpdate,
}) => {
  const statusId = useSelector((state) => state.users.updatingUserId);
  console.log(statusId);
  
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase justify-center bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr scope="col" className="px-6 py-4">
          {headers?.map((header, index) => (
            <th key={index}>{header.name}</th>
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
          data?.map((item, index) => {
            return (
              <tr
                key={index}
                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                  
                `}
              >
                {Object.entries(item).map(([key, value], idx) => {
                  const isClickableObj =
                    typeof value === "object" && value?.onclick;

                  const isStatusButton = value?.isStatusButton;
                  const isActions = value?.isActions;

                  return (
                    <td
                      className="px-3 py-2"
                      key={idx}
                      onClick={
                        isClickableObj && !isStatusButton && !isActions
                          ? () => onUserClick?.(value.id)
                          : undefined
                      }
                      style={
                        isClickableObj && !isStatusButton && !isActions
                          ? { cursor: "pointer" }
                          : {}
                      }
                    >
                      {isStatusButton ? (
                        <>
                          {statusId == value.id ? (
                            "loading.."
                          ) : (
                            <button
                            disabled={statusId == value.id}
                              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                              onClick={() =>
                                onStatusToggle(value.id, !value.checked)
                              }
                            >
                              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                {value.checked ? "active" : "inactive"}
                              </span>
                            </button>
                          )}
                        </>
                      ) : isActions ? (
                        <>
                          <button
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            onClick={() => onUpdate?.(value.id)}
                          >
                            <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                              Update
                            </span>
                          </button>
                          <button
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                            onClick={() => onDelete?.(value.id)}
                          >
                            <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                              Delete
                            </span>
                          </button>
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
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default Table;
