import axios from 'axios';

// const local = 'https://multivendorserver.onrender.com';

export const dashboard_url = 'http://localhost:3001';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});


// const api = axios.create({
//     baseURL: 'https://multivendorserver.onrender.com/api'
// });


export default api;