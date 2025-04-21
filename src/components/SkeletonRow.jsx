import React from "react";

const SkeletonRow = ({ columns = 4 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-[18px] w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
