import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../_styles/modal.module.css';

const Modal = ({ isModalOpen, onClose, children }) => {
  if (isModalOpen !== true) {
    return null;
  }
  return (
    <section className={styles.modal}>
      <article className={styles.modal_content}>
        <div className={styles.modal_close}>
          <button type="button" onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        <div className={styles.modal_children}>{children}</div>
      </article>
    </section>
  );
};

export default Modal;
