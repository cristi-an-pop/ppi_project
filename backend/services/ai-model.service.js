const axios = require('axios');
const FormData = require('form-data');

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5123';

const sendImageToModel = async (endpoint, file) => {
  const formData = new FormData();
  formData.append('image', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype
  });

  const response = await axios.post(`${FLASK_URL}/${endpoint}`, formData, {
    headers: {
      ...formData.getHeaders()
    }
  });

  return response.data;
};

module.exports = {
  sendImageToModel
};