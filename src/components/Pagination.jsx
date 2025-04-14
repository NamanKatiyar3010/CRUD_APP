import React from "react";
import { useNavigate } from "react-router-dom";

const Pagination = ({ num, setSearchParams, searchParams, limit }) => {
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page") || 1, 10);

  const handleChange = (page) => {
    searchParams.set("page", page + 1);
    setSearchParams(searchParams);
    navigate(`/users?limit=${limit}&page=${page + 1}`);
  };

  const styles = {
    list: {
      display: "flex",
      listStyle: "none",
      padding: 0,
      gap: "10px",
      justifyContent: "center",
      marginTop: "20px",
    },
    listItem: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      backgroundColor: "#f4f4f4",
      cursor: "pointer",
      transition: "background-color 0.3s, color 0.3s",
    },
    listItemHover: {
      backgroundColor: "#007bff",
      color: "#fff",
      borderColor: "#007bff",
    },
    activeItem: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "1px solid #007bff",
    },
  };

  return (
    <ul style={styles.list}>
      {Array.from({ length: num }, (_, i) => {
        const pageIndex = i + 1;
        const isActive = currentPage === pageIndex;

        return (
          <li
            key={i}
            style={{
              ...styles.listItem,
              ...(isActive ? styles.activeItem : {}),
            }}
            onClick={() => handleChange(i)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = styles.listItemHover.backgroundColor;
                e.target.style.color = styles.listItemHover.color;
                e.target.style.borderColor = styles.listItemHover.borderColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = styles.listItem.backgroundColor;
                e.target.style.color = "initial";
                e.target.style.borderColor = styles.listItem.border;
              }
            }}
          >
            {pageIndex}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
