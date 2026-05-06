import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 요청 전 공통 처리
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 응답 후 공통 처리
instance.interceptors.response.use(
  (response) => {
    return response.data; // ApiResponse<T> 형태로 바로 받음
  },
  (error) => {
    // 서버에서 내려준 에러 메시지 추출
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "서버 오류가 발생했습니다";
    console.error("API 오류:", message);
    return Promise.reject(new Error(message));
  },
);

export default instance;
