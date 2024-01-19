import axios from 'axios';

const local = 'http://localhost:5000';

// const local = 'https://multivendorserver.onrender.com';

export const base_url = 'http://localhost:3002';

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true
});


export default api;