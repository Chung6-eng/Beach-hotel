import React, { useState, useEffect } from "react"
import moment from "moment"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
	const checkInDate = moment(booking.checkInDate)
	const checkOutDate = moment(booking.checkOutDate)
	const numberOfDays = checkOutDate.diff(checkInDate, "days")
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const navigate = useNavigate()

	const handleConfirmBooking = () => {
		setIsProcessingPayment(true)
		setTimeout(() => {
			setIsProcessingPayment(false)
			setIsBookingConfirmed(true)
			onConfirm()
		}, 3000)
	}

	useEffect(() => {
		if (isBookingConfirmed) {
			navigate("/booking-success")
		}
	}, [isBookingConfirmed, navigate])

	return (
			<div className="card card-body ">
				<h4 className="card-title hotel-color">Reservation Summary</h4>
				<p className="text-start">
					Name: <strong>{booking.guestFullName}</strong>
				</p>
				<p className="text-start">
					Email: <strong>{booking.guestEmail}</strong>
				</p>
				<p className="text-start">
					Check-in Date: <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
				</p>
				<p className="text-start">
					Check-out Date: <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
				</p>
				<p className="text-start">
					Number of Days Booked: <strong>{numberOfDays}</strong>
				</p>

				<div>
					<h5 className="hotel-color">Number of Guest</h5>
					
					<strong className="text-start mb-3">
						<p>Adult{booking.numberOfAdults > 1 ? "s" : ""} : {booking.numberOfAdults}</p>
					</strong>
					<strong className="text-start">
						<p>Children : {booking.numberOfChildren}</p>
					</strong>
				</div>
				
				{payment > 0 ? (
						
					<>
							<img className="img-fluid w-auto rounded mx-auto d-block"  style={{ height: "200px" }} src={"/src/assets/images/QR.png"} alt="Ảnh QR" />
						
						<p>
							Total payment: <strong>${payment}</strong>
						</p>

						{isFormValid && !isBookingConfirmed ? (
							<Button variant="success" onClick={handleConfirmBooking}>
								{isProcessingPayment ? (
									<>
										<span
											className="spinner-border spinner-border-sm mr-2"
											role="status"
											aria-hidden="true"></span>
										Booking Confirmed, redirecting to payment...
									</>
								) : (
									"Confirm Booking & proceed to payment"
								)}
							</Button>
						) : isBookingConfirmed ? (
							<div className="d-flex justify-content-center align-items-center">
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						) : null}
					</>
				) : (
					<p className="text-danger">Check-out date must be after check-in date.</p>
				)}
			</div>
	)
}

export default BookingSummary
