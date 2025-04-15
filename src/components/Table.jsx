import React from "react";
import SkeletonRow from "./SkeletonRow";

const Table = ({ headers, loading, data, onUserClick, onStatusToggle }) => {
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

                return (
                  <td
                    key={idx}
                    onClick={
                      isClickableObj && !isStatusButton
                        ? () => onUserClick?.(value.id)
                        : undefined
                    }
                    style={
                      isClickableObj && !isStatusButton
                        ? { cursor: "pointer" }
                        : {}
                    }
                  >
                    {isStatusButton ? (
                      <button
                        onClick={() =>
                          onStatusToggle(value.id, !value.checked)
                        }
                      >
                        {value.checked ? "active" : "inactive"}
                      </button>
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
