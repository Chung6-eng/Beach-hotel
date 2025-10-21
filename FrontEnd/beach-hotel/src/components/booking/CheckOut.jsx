import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "./BookingForm";
import { getRoomById, bookRoom } from "../utils/ApiFunctions";
import {
  FaTv,
  FaUtensils,
  FaWineGlassAlt,
  FaCar,
  FaParking,
  FaTshirt,
  FaWifi
} from "react-icons/fa";
import RoomCarousel from "../common/RoomCarousel";
import BookingSummary from "./BookingSummary";
import moment from "moment";

const CheckOut = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: ""
  });


  const { roomId } = useParams();
  const [booking, setBooking] = useState({
  guestFullName: "",
  guestEmail: "",
  checkInDate: "",
  checkOutDate: "",
  numberOfAdults: 1,
  numberOfChildren: 0,
  roomId: roomId
});

  const [isValidated, setIsValidated] = useState(false);
  const [payment, setPayment] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfo(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }, 2000);
  }, [roomId]);

  console.log("isSubmitted:", isSubmitted);
  console.log("booking:", booking);

  useEffect(() => {
  if (booking.checkInDate && booking.checkOutDate && roomInfo.roomPrice) {
    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);
    const numberOfDays = checkOut.diff(checkIn, "days");
    const totalPayment = numberOfDays * roomInfo.roomPrice;
    setPayment(totalPayment);
  }
}, [booking.checkInDate, booking.checkOutDate, roomInfo.roomPrice]);


  return (
    <section className="container mt-5">
      <div className="row g-4">
        {/* Cột 1: Room Info */}
        <div className="col-md-4">
          {isLoading ? (
            <p>Loading room information...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="room-info card">
              {roomInfo.photo ? (
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <p>No photo available</p>
              )}

              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Room Type:</strong> {roomInfo.roomType}
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Price per night:</strong> ${roomInfo.roomPrice}
                  </li>
                  <li className="list-group-item">
                    <strong>Room Service:</strong>
                    <ul className="list-unstyled mt-2 mb-0">
                      <li><FaWifi /> Wifi</li>
                      <li><FaTv /> Netflix Premium</li>
                      <li><FaUtensils /> Breakfast</li>
                      <li><FaWineGlassAlt /> Mini bar refreshment</li>
                      <li><FaCar /> Car Service</li>
                      <li><FaParking /> Parking Space</li>
                      <li><FaTshirt /> Laundry</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Cột 2: Booking Form */}
        <div className="col-md-4">
          <BookingForm 
          roomId={roomId}
          booking={booking}
          setBooking={setBooking}
          setIsValidated={setIsValidated}
          setPayment={setPayment}
          setIsSubmitted={setIsSubmitted}
          />

        </div>

        {/* Cột 3: Reservation Summary */}
        <div className="col-md-4 ">
          {isSubmitted && booking && (
            <BookingSummary
              booking={booking}
              payment={payment}
              isFormValid={isValidated}
              onConfirm={async () => {
              await bookRoom(roomId, booking); // ✅ Gọi API ở bước này
              alert("Booking confirmed!");
              }}
              onBack={() => setIsSubmitted(false)} // quay lại form nếu muốn sửa
            />
          )}
        </div>
       

      </div>

      {/* Carousel nằm dưới */}
      <div className="mt-5">
        <RoomCarousel />
      </div>
    </section>
  );
};

export default CheckOut;
