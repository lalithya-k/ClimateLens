import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:5000', // Your Flask backend
});

export const fetchCountries = async () => {
    const response = await API.get('/api/countries');
    return response.data;
};

export default API;
