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


/* This function adds a new room room to the database */
// export const addRoom = async ({ photo, roomType, roomPrice }) => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log("Token sent:", token);

//     const formData = new FormData();
//     formData.append("photo", photo);
//     formData.append("roomType", roomType);
//     formData.append("roomPrice", roomPrice);

//     const response = await axios.post(
//       "http://localhost:2204/rooms/add/new-room",
//       formData,
//       {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error adding room:", error);
//   }
// };



export async function addRoom(photo, roomType, roomPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("FormData contents:", {
        photo: photo.name,
        roomType,
        roomPrice
    });

    try {
        const response = await axios.post(
            "http://localhost:2204/rooms/add/new-room",
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        console.log("Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding room:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
}



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
export async function updateRoom(roomId, roomData) {
	const formData = new FormData()
	formData.append("roomType", roomData.roomType)
	formData.append("roomPrice", roomData.roomPrice)
	formData.append("photo", roomData.photo)
	
	const token = localStorage.getItem("token")
	
	const response = await api.put(`/rooms/update/${roomId}`, formData, {
		headers: {
			Authorization: `Bearer ${token}`
			// BỎ Content-Type
		}
	})
	return response
}

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
export async function bookRoom(roomId, booking) {
	try {
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking,{ headers: getHeader() })
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings", {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
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
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
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
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

/* This function login a registered user */
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
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

/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
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

/* This is the function to get user bookings by the user id */
export const getBookingsByUserId = async (email) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, please login.");

    const response = await api.get(`/bookings/user/${email}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};



// export const getBookingsByUserId = async () => {
//   const token = localStorage.getItem("token"); // hoặc nơi bạn lưu token
//   return await axios.get("http://localhost:2204/bookings/user/bookings", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

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



