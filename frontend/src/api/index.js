import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

// Auto-attach token to every request
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch { /* unauthenticated request */ }
  return config
})

// Events
export const eventsApi = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

// Registrations
export const registrationsApi = {
  register: (eventId) => api.post(`/events/${eventId}/register`),
  getMine: () => api.get('/registrations/me'),
  cancel: (id) => api.patch(`/registrations/${id}/cancel`),
}

// Files
export const filesApi = {
  getPresignedUrl: (contentType, folder) =>
    api.post('/files/presigned-url', { contentType, folder }),
  uploadToS3: (uploadUrl, file) =>
    axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
    }),
}

export default api
