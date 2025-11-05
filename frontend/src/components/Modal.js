import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const nodeRef = useRef(null); 

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef} 
    >
      <div
        ref={nodeRef} 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded p-6 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
          >
            ✖
          </button>
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
