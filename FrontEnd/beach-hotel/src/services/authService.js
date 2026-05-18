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

export async function registerUser(registration) {
  try {
    const response = await api.post(`${BASE_URL}/auth/register-user`, registration)
    return response.data
  } catch (error) {
    let message = "User registration error"

    if (error.response) {
      const data = error.response.data
      if (data && typeof data === "object" && data.message) {
        message = data.message
      } else if (typeof data === "string") {
        message = data
      } else {
        message = JSON.stringify(data)
      }
    } else if (error.message) {
      message = error.message
    }

    throw new Error(message)
  }
}

export async function getUserProfile(userId) {
  const response = await api.get(`/users/profile/${userId}`, {
    headers: getHeader()
  })
  return response.data
}

export async function getUser(userId) {
  const response = await api.get(`/users/${userId}`, {
    headers: getHeader()
  })
  return response.data
}

export const loginUser = async (login) => {
  console.log("🔄 Đang gọi API login:", login)

  try {
    const response = await api.post("/auth/login", login)
    console.log("✅ Token nhận được:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message)
    return null
  }
}

export async function deleteUser(email) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/users/delete/${email}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error("Failed to delete user")
  }
}

export const getUserByEmail = async (email) => {
  const token = localStorage.getItem("token")
  if (!token) {
    console.error("Token is missing!")
    throw new Error("Unauthorized!")
  }

  try {
    const response = await axios.get(`${BASE_URL}/users/email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    return response.data
  } catch (error) {
    console.error("Lỗi lấy user:", error.response || error)
    throw error
  }
}
