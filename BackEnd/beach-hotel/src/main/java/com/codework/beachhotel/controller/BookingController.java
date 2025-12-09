package com.codework.beachhotel.controller;

import com.codework.beachhotel.exception.InvalidBookingRequestException;
import com.codework.beachhotel.exception.ResourceNotFoundException;
import com.codework.beachhotel.model.BookedRoom;
import com.codework.beachhotel.model.Room;
import com.codework.beachhotel.response.BookingResponse;
import com.codework.beachhotel.response.RoomResponse;
import com.codework.beachhotel.service.BookingService;
import com.codework.beachhotel.service.IBookingService;
import com.codework.beachhotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final IBookingService bookingService;
    private final RoomService roomService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasAnyRole('MANAGER','STAFF')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok().body(bookingResponses);
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        try{
            BookedRoom booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

    }
    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId, @RequestBody BookedRoom bookingRequest) {

        try{
            String confirmationCode = bookingService.saveBooking(roomId,bookingRequest);
            return ResponseEntity.ok("Room booked Successfully, Your booking confirmation code is: " + confirmationCode);
        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
    }


    @GetMapping("/check-duplicate")
    @PreAuthorize("hasAnyRole('USER','MANAGER','STAFF')")
    public ResponseEntity<?> checkDuplicateBooking(
            @RequestParam Long roomId,
            @RequestParam String email,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        try {
            boolean duplicate = bookingService.checkDuplicate(
                    roomId, email,
                    LocalDate.parse(checkIn),
                    LocalDate.parse(checkOut)
            );

            return ResponseEntity.ok(Map.of(
                    "duplicate", duplicate,
                    "message", duplicate ? "You already booked this room on these dates" : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }




    private BookingResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = roomService.getRoomById(booking.getRoom().getId()).orElse(null);
        RoomResponse room = null;
        if (theRoom != null) {
            room = new RoomResponse(
                    theRoom.getId(),
                    theRoom.getRoomType(),
                    theRoom.getRoomPrice(),
                    theRoom.getDescription()
            );
        }

        return new BookingResponse(
                booking.getBookingId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getGuestFullName(),
                booking.getGuestEmail(),
                booking.getNumberOfAdults(),
                booking.getNumberOfChildren(),
                booking.getTotalNumberOfGuest(),
                booking.getBookingConfirmationCode(),
                theRoom != null ? theRoom.getId() : null,
                room,
                booking.getTotalPayment()
        );
    }


    @GetMapping("/user/{email}/bookings")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER','STAFF')")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable String email, Authentication authentication) {
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        System.out.println("Found " + bookings.size() + " bookings");

        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);  // Sử dụng method đã có
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

}
