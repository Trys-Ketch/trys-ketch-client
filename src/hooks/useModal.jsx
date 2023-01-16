import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '../app/slices/modalSlice';

function useModal() {
  const dispatch = useDispatch();

  const handleOpenModal = (type) => {
    dispatch(openModal(type));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}

export default useModal;
