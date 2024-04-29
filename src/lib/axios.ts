import axios from "axios";

export const axiosApi = axios.create({
    baseURL: "https://api.jobo.uz/v1/_utils/yalpiz/",
    headers: {
        "Content-Type": "application/json",
    },
});
