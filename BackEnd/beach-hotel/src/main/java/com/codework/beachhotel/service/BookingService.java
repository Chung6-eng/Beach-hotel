package com.codework.beachhotel.service;


import com.codework.beachhotel.DTO.BookingDTO;
import com.codework.beachhotel.exception.InvalidBookingRequestException;
import com.codework.beachhotel.model.BookedRoom;
import com.codework.beachhotel.model.Room;
import com.codework.beachhotel.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final IRoomService roomService;

    @Override
    public List<BookingDTO> getAllBookingDTOs() {
        return bookingRepository.findAll()
                .stream()
                .map(booking -> {
                    BookingDTO dto = BookingDTO.fromEntity(booking);
                    return dto;
                })
                .toList();
    }

    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<BookedRoom> bookings = bookingRepository.findByRoomId(roomId);

        for (BookedRoom booking : bookings) {
            // Kiểm tra xung đột ngày
            if ((checkIn.isBefore(booking.getCheckOutDate()) && checkOut.isAfter(booking.getCheckInDate())) ||
                    checkIn.equals(booking.getCheckInDate()) || checkOut.equals(booking.getCheckOutDate())) {
                return false; // phòng đã được đặt
            }
        }
        return true; // phòng còn trống
    }

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId){
        return bookingRepository. findByRoomId(roomId);
    }

    public List<BookedRoom> getBookingsByUserEmail(String email) {
        System.out.println("Searching bookings for email: " + email);
        List<BookedRoom> bookings = bookingRepository.findByGuestEmail(email);
        System.out.println("Query returned: " + bookings.size() + " bookings");
        return bookings;
    }

    @Override
    public boolean checkDuplicate(Long roomId, String email, LocalDate checkIn, LocalDate checkOut) {

        // Lấy tất cả booking của user theo email
        List<BookedRoom> bookings = bookingRepository.findByGuestEmail(email);

        // Kiểm tra xem có booking nào bị trùng ngày + cùng phòng
        for (BookedRoom b : bookings) {

            boolean sameRoom = b.getRoom().getId().equals(roomId);

            boolean overlap = !(checkOut.isBefore(b.getCheckInDate()) ||
                    checkIn.isAfter(b.getCheckOutDate()));

            if (sameRoom && overlap) {
                return true;   // ⛔ Có trùng
            }
        }

        return false;  // ✔ Không trùng
    }


    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check In Date must come before Check Out Date");
        }
        Room room = roomService.getRoomById(roomId).get();
        List<BookedRoom> existingBookings = room.getBookings();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingBookings);
        if (roomIsAvailable) {
            room.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("Sorry, This room is not available for the selected dates;");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode);
    }


//    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
//        return existingBookings.stream()
//                .noneMatch(existingBooking ->
//                        bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate())
//                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate())
//                );
//    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        (bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate()))
                                || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                ||bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                &&bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate())

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))

                );
    }
}