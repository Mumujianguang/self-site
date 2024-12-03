import login from "@/modules/login";
import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use((request) => {
    // auth token
    request.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`

    return request
})

api.interceptors.response.use(
    (values) => values,
    (error) => {

        if (error.response.status === 401) {
            login()
        }

        return Promise.reject(error);
    }
)