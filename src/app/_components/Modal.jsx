import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../_styles/modal.module.css';

const Modal = ({ isModalOpen, onClose, children }) => {
  if (isModalOpen !== true) {
    document.getElementsByTagName("BODY")[0].style.overflow = 'auto';  
    return null;
    } else {
    document.getElementsByTagName("BODY")[0].style.overflow = 'hidden';
  }

  return (
    <section className={styles.modal}>
      <article className={styles.modal_content}>
        <button type="button" onClick={onClose} className={styles.modal_close}>
          <AiOutlineClose />
        </button>
        <div className={styles.modal_children}>{children}</div>
      </article>
    </section>
  );
};

export default Modal;
