import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const api = axios.create({
  baseURL: BASE_URL
})

const getHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
}

export const bookRoom = async (roomId, bookingData) => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.")
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/bookings/room/${roomId}/booking`,
      bookingData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("API ERROR:", error.response)
    throw new Error("Lỗi server: " + (error.response?.data || error.message))
  }
}

export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings/all-bookings", {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    console.log("Error fetching bookings:", error)
    throw error
  }
}

export async function checkDuplicateBooking(roomId, email, checkIn, checkOut) {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No token found. Please login first.")
  }

  const response = await fetch(
    `${BASE_URL}/bookings/check-duplicate?roomId=${encodeURIComponent(roomId)}&email=${encodeURIComponent(email)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  )

  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const err = await response.json()
      throw new Error(err.message || "Server error")
    } else {
      throw new Error("Server returned HTML error page")
    }
  }

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid server response (not JSON)")
  }

  return await response.json()
}

export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
    return result.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data)
    } else {
      throw new Error(`Error find booking : ${error.message}`)
    }
  }
}

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/booking/${bookingId}/delete`, {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    console.error("Error canceling booking:", error)
    throw error
  }
}

export const getBookingsByUserId = async (userId) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token, please login")

  const response = await axios.get(
    `${BASE_URL}/bookings/user/${userId}/bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}
