import axios from "axios"

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "")
export const api = axios.create({
  baseURL: BASE_URL || undefined
})

const getHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
}

export const addRoom = async (photo, roomType, roomPrice, description) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found. Please login as admin.")

  const formData = new FormData()
  formData.append("photo", photo)
  formData.append("roomType", roomType)
  formData.append("roomPrice", roomPrice)
  formData.append("description", description)

  try {
    const response = await axios.post(
      `${BASE_URL}/rooms/add/new-room`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Error adding room:", error)
    if (error.response) console.error("Error response:", error.response.data)
    throw error
  }
}

export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types", {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    console.error("Error fetching room types:", error.response || error)
    throw new Error("Error fetching room types")
  }
}

export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms", {
      headers: getHeader()
    })
    
    const data = result.data
    
    // Trả về đúng array tùy theo format backend
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.rooms)) return data.rooms
    if (Array.isArray(data?.content)) return data.content // Spring Boot
    
    return [] // fallback
  } catch (error) {
    console.error("Error fetching rooms:", error.response || error.message)
    throw error
  }
}

export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader()
    })
    return result.data
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`)
  }
}

export const updateRoom = async (roomId, formData) => {
  const token = localStorage.getItem("token")
  const response = await axios.put(
    `${BASE_URL}/rooms/update/${roomId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`)
    return result.data
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`)
  }
}

export const fetchRoomPriceById = async (roomId) => {
  const token = localStorage.getItem("token")
  if (!token) {
    console.error("No token found. Please login first.")
    return
  }

  try {
    const response = await axios.get(`${BASE_URL}/rooms/${roomId}/price`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error fetching room price:", error)
  }
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  try {
    const response = await api.get(
      `/rooms/available-rooms?checkInDate=${encodeURIComponent(checkInDate)}&checkOutDate=${encodeURIComponent(checkOutDate)}&roomType=${encodeURIComponent(roomType)}`,
      {
        headers: getHeader()
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching available rooms:", error.response || error)
    throw error
  }
}
