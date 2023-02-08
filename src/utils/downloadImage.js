import axios from 'axios';
import { saveAs } from 'file-saver';

const downloadImage = async (imgPath) => {
  axios.get(imgPath, { responseType: 'blob' }).then(async (res) => {
    saveAs(res.data, `🎨trys-ketch.png`);
  });
};

export default downloadImage;
