import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./deleteModal.module.css";

export type DeleteModalProps = {
  isOpen: boolean;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
};

const portalTarget = typeof document !== "undefined" ? document.body : null;

const DeleteModal = ({
  isOpen,
  title = "Delete item",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false
}: DeleteModalProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
    }
    cancelButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      if (body) {
        body.style.overflow = "";
      }
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div className={styles.backdrop} role="presentation" onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modal__header}>
          <h2 id="delete-modal-title">{title}</h2>
        </div>
        <div className={styles.modal__body} id="delete-modal-description">
          {description}
        </div>
        <div className={styles.modal__actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            ref={cancelButtonRef}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    portalTarget,
  );
};

export default DeleteModal;
