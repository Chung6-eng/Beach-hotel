import { React, useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import DateSlider from "../common/DateSlider";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
  const [filteredBookings, setFilteredBookings] = useState(bookingInfo || []);

  useEffect(() => {
    setFilteredBookings(bookingInfo || []);
  }, [bookingInfo]);

  const filterBookings = (startDate, endDate) => {
  if (!startDate || !endDate) {
    setFilteredBookings(bookingInfo || []);
    return;
  }

  const filtered = bookingInfo.filter((booking) => {
    // đảm bảo là string
    const bookingStartDate = parseISO(booking.checkInDate?.toString());
    const bookingEndDate = parseISO(booking.checkOutDate?.toString());
    return bookingStartDate <= endDate && bookingEndDate >= startDate;
  });

  setFilteredBookings(filtered);
};

  const totalNumberOfGuest = (booking) => {
    return booking.numOfAdults + booking.numOfChildren;
  }
console.log("bookingInfo:", bookingInfo);

  return (
    <section className='p-4'>
      <DateSlider onDataChange={filterBookings} onFilterChange={filterBookings} />
      <table className='table table-bordered table-hover shadow'>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Booking ID</th>
            <th>Room Id</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Guest Name</th>
            <th>Guest Email</th>
            <th>Adults</th>
            <th>Children</th>
            <th>Total Guest</th>
            <th>Confirmation Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {filteredBookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              <td>{booking.id}</td>
              <td>{booking.roomId}</td>
              <td>{booking.checkInDate}</td>
              <td>{booking.checkOutDate}</td>
              <td>{booking.guestFullName}</td>
              <td>{booking.guestEmail}</td>
              <td>{booking.numOfAdults}</td>
              <td>{booking.numOfChildren}</td>
              <td>{totalNumberOfGuest(booking)}</td>
              <td>{booking.bookingConfirmationCode}</td>
              <td>
                <button className='btn btn-danger btn-sm'
                  onClick={() => handleBookingCancellation(booking.id)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredBookings.length === 0 && <p>No booking found for the selected dates</p>}
    </section>
  );
};

export default BookingsTable;
