import axios from 'axios';

// usamos o create para criar uma url base
const api = axios.create({
    baseURL: 'https://api.github.com',
});

export default api;