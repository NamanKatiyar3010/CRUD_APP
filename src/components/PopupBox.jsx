import { useEffect } from "react";

const PopupBox = ({ isOpen, onClose, title, children, footerLeft, footerRight }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 md:mx-0 dark:bg-gradient-to-br dark:from-[#1e293b] dark:via-[#111827] dark:to-[#0f172a] bg-white text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        {title && (
          <div className="px-6 pt-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer with left & right aligned buttons */}
        {(footerLeft || footerRight) && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div>{footerLeft}</div>
            <div>{footerRight}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupBox;
