import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";

const Modal = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl p-6 px-10 max-w-[90%] "
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
        >
          <IoClose size={22} />
        </button>
        <div className="text-left items-center">{children}</div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default Modal;
