package com.codework.beachhotel.service;

import com.codework.beachhotel.DTO.BookingDTO;
import com.codework.beachhotel.model.BookedRoom;
import com.codework.beachhotel.repository.BookingRepository;

import java.util.List;

public interface IBookingService {
    void cancelBooking(Long bookingId);
    List<BookingDTO> getAllBookingDTOs();



    List<BookedRoom> getAllBookingsByRoomId(Long roomId);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> getAllBookings();

//    private final BookingRepository bookingRepository;
    List<BookedRoom> getBookingsByUserEmail(String email);
    // Lấy danh sách bookings theo email user
//    public List<BookedRoom> getBookingsByUserEmail(String email) {
//        return bookingRepository.findByUserEmail(email);
//    }
}
