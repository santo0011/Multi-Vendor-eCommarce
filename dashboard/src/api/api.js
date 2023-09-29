import axios from 'axios';

// const local = 'https://multivendorserver.onrender.com';

export const dashboard_url = 'http://localhost:3000';

const api = axios.create({
    baseURL: 'https://multivendorserver.onrender.com/api'
});


export default api;