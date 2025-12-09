/* eslint-disable no-useless-catch */
import axios from "axios"
export const api = axios.create({
	baseURL: "http://localhost:2204"
})

export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}

export const addRoom = async (photo, roomType, roomPrice, description) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login as admin.");

  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);
  formData.append("description", description);

  try {
    const response = await axios.post(
      "http://localhost:2204/rooms/add/new-room",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding room:", error);
    if (error.response) console.error("Error response:", error.response.data);
    throw error;
  }
};




/* This function gets all room types from thee database */
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types", {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching room types:", error.response || error);
    throw new Error("Error fetching room types");
  }
}


/* This function gets all rooms from the database */
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms", {
      headers: getHeader()
    });
    return result.data;
  } catch (error) {
    console.error("Error fetching rooms:", error.response || error.message);
    throw error;
  }
}



/* This function deletes a room by the Id */
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
/* This function update a room */
export const updateRoom = async (roomId, formData) => {
  const token = localStorage.getItem("token"); // hoặc nơi bạn lưu JWT

  const response = await axios.put(
    `http://localhost:2204/rooms/update/${roomId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}` // 🔹 quan trọng
      },
    }
  );
  return response.data;
};


/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function saves a new booking to the databse */
export const bookRoom = async (roomId, bookingData) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    try {
        const response = await axios.post(
            `http://localhost:2204/bookings/room/${roomId}/booking`,
            bookingData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("API ERROR:", error.response);
        throw new Error("Lỗi server: " + (error.response?.data || error.message));
    }
};



/* This function gets alll bokings from the database */
export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings/all-bookings", {
      headers: getHeader()
    })
    return response.data
  } catch (error) {
    console.log("Error fetching bookings:", error);
    throw error;
  }
}

export async function checkDuplicateBooking(roomId, email, checkIn, checkOut) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:2204/bookings/check-duplicate?roomId=${roomId}&email=${email}&checkIn=${checkIn}&checkOut=${checkOut}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const err = await response.json();
      throw new Error(err.message || "Server error");
    } else {
      throw new Error("Server returned HTML error page");
    }
  }

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid server response (not JSON)");
  }

  return await response.json();
}



/* This function get booking by the cnfirmation code */
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

/* This is the function to cancel user booking */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(
      `/bookings/booking/${bookingId}/delete`,
      { headers: getHeader() } // 👈 Thêm dòng này
    )
    return response.data
  } catch (error) {
    console.error("Error canceling booking:", error)
    throw error
  }
}

/* This function gets all availavle rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}

/* This function register a new user */
export async function registerUser(registration) {
  try {
    const response = await api.post("http://localhost:2204/auth/register-user", registration);
    return response.data;
  } catch (error) {
    let message = "User registration error";

    // Nếu backend trả về response
    if (error.response) {
      const data = error.response.data;

      // Nếu backend trả về { message: "..." }
      if (data && typeof data === "object" && data.message) {
        message = data.message;
      } 
      // Nếu backend trả về string
      else if (typeof data === "string") {
        message = data;
      } 
      // Trường hợp khác
      else {
        message = JSON.stringify(data);
      }
    } 
    // Nếu lỗi khác (network, axios)
    else if (error.message) {
      message = error.message;
    }

    throw new Error(message);
  }
}



/*  This is function to get the user profile */
export async function getUserProfile(userId) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}


/* This is the function to get a single user */
export async function getUser(userId) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}

export const loginUser = async (login) => {
	console.log("🔄 Đang gọi API login:", login);

	try {
		const response = await api.post("/auth/login", login);
		console.log("✅ Token nhận được:", response.data);
		return response.data;
	} catch (error) {
		console.error("❌ Login error:", error.response?.data || error.message);
		return null;
	}
};

export async function deleteUser(email) {
  const token = localStorage.getItem("token")
  const response = await fetch(`http://localhost:2204/users/delete/${email}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
  })

  if (!response.ok) {
    throw new Error("Failed to delete user")
  }
}


// ApiFunctions.js - Updated getBookingsByUserId to use userId instead of email
export const getBookingsByUserId = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token, please login");

  const response = await axios.get(
    `http://localhost:2204/bookings/user/${userId}/bookings`,  // Changed from email to userId
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchRoomPriceById = async (roomId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login first.");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:2204/rooms/${roomId}/price`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching room price:", error);
  }
};

export const getUserByEmail = async (email) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token is missing!");
    throw new Error("Unauthorized!");
  }

  try {
    const response = await axios.get(
      `http://localhost:2204/users/email/${email}`, // ✅ Đổi thành endpoint đúng
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Lỗi lấy user:", error.response || error)
    throw error
  }
}


