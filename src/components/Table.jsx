import React from "react";

const Table = ({ headers, loading, data, onUserClick }) => {
  return (
    <>
      <table>
        <thead>
          <>
            <tr>
              {headers?.map((header, index) => (
                <>
                  <th key={index}>{header.name}</th>
                </>
              ))}
            </tr>
          </>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : (
            <>
              {data?.map((item, index) => (
                <>
                  <tr key={index}>
                    {Object?.entries(item).map(([key, value], indexes) => {
                      const isClickableObj =
                        typeof value === "object" && value?.onclick;
                      return (
                        <td
                          key={indexes}
                          onClick={
                            isClickableObj
                              ? () => onUserClick?.(value.id)
                              : undefined
                          }
                          style={isClickableObj ? { cursor: "pointer" } : {}}
                        >
                          {typeof value === "object" ? value?.text : value}
                        </td>
                      );
                    })}
                  </tr>
                </>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Table;
