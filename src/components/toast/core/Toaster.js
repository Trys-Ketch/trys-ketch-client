import { nanoid } from 'nanoid';

class Toaster {
  static setToastItems = () => {};

  constructor(setState) {
    if (setState) this.setToastItems = setState;
  }

  addToastItem({ type, message }) {
    this.setToastItems((state) => [{ id: nanoid(), type, message }, ...state]);
  }

  removeToastItem(toastId) {
    this.setToastItems((state) => state.filter((item) => item.id !== toastId));
  }

  success(message) {
    this.addToastItem({ type: 'success', message });
  }

  info(message) {
    this.addToastItem({ type: 'info', message });
  }

  error(message) {
    this.addToastItem({ type: 'error', message });
  }
}

export default Toaster;
