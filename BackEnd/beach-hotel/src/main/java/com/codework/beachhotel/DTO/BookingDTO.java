package com.codework.beachhotel.DTO;

import com.codework.beachhotel.model.BookedRoom;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingDTO {
    private Long bookingId;
    private Long roomId;
    private String guestFullName;
    private String guestEmail;
    private int numOfAdults;
    private int numOfChildren;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String bookingConfirmationCode;

    public static BookingDTO fromEntity(BookedRoom booking) {
        BookingDTO dto = new BookingDTO();
        dto.bookingId = booking.getBookingId();
        dto.setRoomId(booking.getRoom().getId());
        dto.guestFullName = booking.getGuestFullName();
        dto.guestEmail = booking.getGuestEmail();
        dto.numOfAdults = booking.getNumberOfAdults();
        dto.numOfChildren = booking.getNumberOfChildren();
        dto.checkInDate = booking.getCheckInDate();
        dto.checkOutDate = booking.getCheckOutDate();
        dto.bookingConfirmationCode = booking.getBookingConfirmationCode();
        return dto;
    }
}

