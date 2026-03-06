import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
    withCredentials: true,
})

// Attach access token from sessionStorage on every request
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

// On 401, attempt a token refresh then retry once
api.interceptors.response.use(
    (r) => r,
    async (err) => {
        const original = err.config
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true
            try {
                const r = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                )
                const newToken: string = r.data.accessToken
                sessionStorage.setItem('accessToken', newToken)
                original.headers['Authorization'] = `Bearer ${newToken}`
                return api(original)
            } catch {
                sessionStorage.removeItem('accessToken')
                return Promise.reject(err)
            }
        }
        return Promise.reject(err)
    }
)

export default api
