import axios from 'axios';

export const dashboard_url = 'http://localhost:3000';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

 

export default api;