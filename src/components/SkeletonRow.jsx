import React from "react";

const SkeletonRow = ({ columns = 4 }) => {
  const shimmerStyle = {
    height: "18px",
    background: "linear-gradient(90deg, #eee, #f5f5f5, #eee)",
    backgroundSize: "200% 100%",
    animation: "skeletonPulse 1.5s infinite",
    borderRadius: "6px",
  };

  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: "12px" }}>
          <div style={shimmerStyle}></div>
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
