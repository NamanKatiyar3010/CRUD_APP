import { useEffect } from "react";
import "./index.css";

const PopupBox = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        {title && <h2 className="popup-title">{title}</h2>}
        <div className="popup-content">{children}</div>
        {footer && <div className="popup-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default PopupBox;
