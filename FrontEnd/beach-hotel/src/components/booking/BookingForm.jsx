import React, { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import moment from "moment";
import { fetchRoomPriceById } from "../../services/roomService";
import { checkDuplicateBooking } from "../../services/bookingService";

const BookingForm = ({ roomId, booking, setBooking, setIsValidated, setIsSubmitted, setPayment }) => {
  const [isValidated, setLocalValidated] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetchRoomPriceById(roomId);
        setRoomPrice(response.roomPrice);
      } catch (err) {
        console.error("Error fetching room price:", err);
      }
    };
    fetchPrice();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const isGuestCountValid = () => {
    const adults = parseInt(booking.numberOfAdults);
    const children = parseInt(booking.numberOfChildren);
    return adults >= 1 && adults + children >= 1;
  };

  const isCheckOutDateValid = () => {
    if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
      setErrorMessage("Check-out date must be after check-in date");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const calculatePayment = () => {
    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);
    const days = checkOut.diff(checkIn, "days");
    return days * roomPrice;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  // Kiểm tra HTML5 + validate custom
  if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
    e.stopPropagation();
    setLocalValidated(true);
    setIsValidated(true);
    return;
  }

  try {

    // 🔍 1. Kiểm tra trùng booking
    const dup = await checkDuplicateBooking(
      roomId,
      booking.guestEmail,
      booking.checkInDate,
      booking.checkOutDate
    );

    if (dup.duplicate) {
      setErrorMessage("Room unavailable for the selected dates.");   
      return;                        
    }

    // 2️⃣ Tính tiền
    setPayment(calculatePayment());

    // 3️⃣ Cho phép chuyển bước tiếp theo
    setIsSubmitted(true);

  } catch (err) {
    setErrorMessage(err.message || "Something went wrong!");
  }

  setLocalValidated(true);
  setIsValidated(true);
};


  return (
    <div className="card card-body">
      <h4>Reserve Room</h4>
      <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label className= "d-block text-start">Full Name:</Form.Label>
          <FormControl
            required
            type="text"
            name="guestFullName"
            value={booking.guestFullName}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />
          <Form.Control.Feedback type="invalid">Please enter full name</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="d-block text-start">Email:</Form.Label>
          <FormControl
            required
            type="email"
            name="guestEmail"
            value={booking.guestEmail}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
          <Form.Control.Feedback type="invalid">Please enter email</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="d-block text-start">Check-in Date:</Form.Label>
          <FormControl
            required
            type="date"
            name="checkInDate"
            value={booking.checkInDate}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="d-block text-start">Check-out Date:</Form.Label>
          <FormControl
            required
            type="date"
            name="checkOutDate"
            value={booking.checkOutDate}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="d-block text-start">Adults:</Form.Label>
          <FormControl
            required
            type="number"
            min={1}
            name="numberOfAdults"
            value={booking.numberOfAdults}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="d-block text-start">Children:</Form.Label>
          <FormControl
            type="number"
            min={0}
            name="numberOfChildren"
            value={booking.numberOfChildren}
            onChange={handleInputChange}
          />
        </Form.Group>

        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        <Button type="submit" variant="success">Continue</Button>
      </Form>
    </div>
  );
};

export default BookingForm;
