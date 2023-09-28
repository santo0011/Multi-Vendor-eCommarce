import axios from 'axios';

// const local = 'http://localhost:5000';

const local = 'https://multivendorserver.onrender.com';

export const base_url = 'https://multivendorecommarceclient.netlify.app';

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true
});


export default api;