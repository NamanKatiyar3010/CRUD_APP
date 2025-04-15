import React from "react";
import SkeletonRow from "./SkeletonRow";

const Table = ({
  headers,
  loading,
  data,
  onUserClick,
  onStatusToggle,
  onDelete,
  onUpdate,
}) => {
  return (
    <table>
      <thead>
        <tr>
          {headers?.map((header, index) => (
            <th key={index}>{header.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <>
            <SkeletonRow columns={headers.length} />
            <SkeletonRow columns={headers.length} />
            <SkeletonRow columns={headers.length} />
          </>
        ) : (
          data?.map((item, index) => (
            <tr key={index}>
              {Object.entries(item).map(([key, value], idx) => {
                const isClickableObj =
                  typeof value === "object" && value?.onclick;

                const isStatusButton = value?.isStatusButton;
                const isActions = value?.isActions;

                return (
                  <td
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
                      <button
                        onClick={() => onStatusToggle(value.id, !value.checked)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        {value.checked ? "active" : "inactive"}
                      </button>
                    ) : isActions ? (
                      <>
                        <button
                          onClick={() => onUpdate?.(value.id)}
                          style={{ marginRight: "0.5rem" }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => onDelete?.(value.id)}
                          style={{ color: "red" }}
                        >
                          Delete
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
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
