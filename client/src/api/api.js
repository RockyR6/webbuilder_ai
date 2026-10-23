import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "",
    withCredentials: true,
});



// Setup Mock API adapter on Axios


export default api;
