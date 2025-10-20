import React, { useEffect, useState } from "react"
import { deleteUser, getBookingsByUserId, getUser } from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"
import moment from "moment"

const Profile = () => {
	const [user, setUser] = useState({
		id: "",
		email: "",
		firstName: "",
		lastName: "",
		roles: [{ id: "", name: "" }]
	})
	

	// 👉 Khởi tạo rỗng để tránh render dữ liệu giả
	const [bookings, setBookings] = useState([]);

	const [message, setMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const userId = localStorage.getItem("userId")
	const token = localStorage.getItem("token")

	// 👉 Lấy thông tin user
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUser(userId, token)
				setUser(userData)
			} catch (error) {
				console.error("Error fetching user:", error)
				setErrorMessage("Failed to load user info")
			}
		}

		if (userId && token) {
			fetchUser()
		}
	}, [userId, token])

	// 👉 Lấy danh sách bookings theo user
	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await getBookingsByUserId(userId, token)
				setBookings(response.data)
			} catch (error) {
				console.error("Error fetching bookings:", error)
				setErrorMessage("Failed to load bookings")
			}
		}

		if (userId && token) {
			fetchBookings()
		}
	}, [userId, token])

	// 👉 Xóa tài khoản
	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		)
		if (confirmed) {
			try {
				const response = await deleteUser(userId)
				setMessage(response.data)
				localStorage.removeItem("token")
				localStorage.removeItem("userId")
				localStorage.removeItem("userRole")
				navigate("/")
				window.location.reload()
			} catch (error) {
				console.error("Error deleting account:", error)
				setErrorMessage("Failed to delete account")
			}
		}
	}

	useEffect(() => {
  if (!user.email) return; // tránh gọi khi email chưa có
  const fetchData = async () => {
    try {
      const data = await getBookingsByUserId(user.email);
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  fetchData();
}, [user.email]);



	return (
		<div className="container">
			{errorMessage && <p className="text-danger">{errorMessage}</p>}
			{message && <p className="text-success">{message}</p>}
			{user ? (
				<div className="card p-5 mt-5" style={{ backgroundColor: "whitesmoke" }}>
					<h4 className="card-title text-center">User Information</h4>
					<div className="card-body">
						<div className="col-md-10 mx-auto">
							{/* User Info */}
							<div className="card mb-3 shadow">
								<div className="row g-0">
									<div className="col-md-2 d-flex justify-content-center align-items-center mb-4">
										<img
											src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
											alt="Profile"
											className="rounded-circle"
											style={{ width: "150px", height: "150px", objectFit: "cover" }}
										/>
									</div>

									<div className="col-md-10">
										<div className="card-body">
											<div className="form-group row">
												<label className="col-md-2 col-form-label fw-bold">ID:</label>
												<div className="col-md-10">
													<p className="card-text">{user.id}</p>
												</div>
											</div>
											<hr />

											<div className="form-group row">
												<label className="col-md-2 col-form-label fw-bold">First Name:</label>
												<div className="col-md-10">
													<p className="card-text">{user.firstName}</p>
												</div>
											</div>
											<hr />

											<div className="form-group row">
												<label className="col-md-2 col-form-label fw-bold">Last Name:</label>
												<div className="col-md-10">
													<p className="card-text">{user.lastName}</p>
												</div>
											</div>
											<hr />

											<div className="form-group row">
												<label className="col-md-2 col-form-label fw-bold">Email:</label>
												<div className="col-md-10">
													<p className="card-text">{user.email}</p>
												</div>
											</div>
											<hr />

											<div className="form-group row">
												<label className="col-md-2 col-form-label fw-bold">Roles:</label>
												<div className="col-md-10">
													<ul className="list-unstyled">
														{user.roles.map((role) => (
															<li key={role.id} className="card-text">
																{role.name}
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<h4 className="card-title text-center">Booking History</h4>

							{bookings && bookings.length > 0 ? (
								<table className="table table-bordered table-hover shadow">
									<thead>
										<tr>
											<th scope="col">Booking ID</th>
											<th scope="col">Room ID</th>
											<th scope="col">Room Type</th>
											<th scope="col">Check In Date</th>
											<th scope="col">Check Out Date</th>
											<th scope="col">Confirmation Code</th>
											<th scope="col">Status</th>
										</tr>
									</thead>
									<tbody>
										{bookings.map((booking, index) => (
											<tr key={index}>
												<td>{booking.bookingId}</td>
												<td>{booking.room?.id || "N/A"}</td>
												<td>{booking.room?.roomType || "N/A"}</td>
												<td>
  												{booking.checkInDate
    											? moment(new Date(...booking.checkInDate)).format("MMM Do, YYYY")
    											: "N/A"}
												</td>
												<td>
  												{booking.checkOutDate
    											? moment(new Date(...booking.checkOutDate)).format("MMM Do, YYYY")
    											: "N/A"}
												</td>

												<td>{booking.bookingConfirmationCode}</td>
												<td className="text-success">On-going</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>You have not made any bookings yet.</p>
							)}

							<div className="d-flex justify-content-center">
								<button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
									Close account
								</button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	)
}

export default Profile
