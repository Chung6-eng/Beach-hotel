package com.codework.beachhotel.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String guestFullName;
    private String guestEmail;
    private int numOfAdults;
    private int numOfChildren;
    private int totalNumOfGuest;
    private String bookingConfirmationCode;
    private Long roomId;
    private RoomResponse room;

    // Constructor rút gọn (nếu chỉ muốn trả một số thông tin cơ bản)
    public BookingResponse(Long id,RoomResponse room, LocalDate checkInDate, LocalDate checkOutDate, String bookingConfirmationCode) {
        this.room = room;
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingConfirmationCode = bookingConfirmationCode;
    }
}
