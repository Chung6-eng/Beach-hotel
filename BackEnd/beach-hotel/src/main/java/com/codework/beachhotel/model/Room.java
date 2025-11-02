package com.codework.beachhotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.RandomStringUtils;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;

import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String roomType;

    private BigDecimal roomPrice;

    private boolean isBoook = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @JsonIgnore
    private Blob photo;

    @OneToMany(mappedBy="room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BookedRoom> bookings;

    public Room() {
        this.bookings = new ArrayList<>();
    }

    public void addBooking(BookedRoom booking) {
        if(booking == null) {
            bookings = new ArrayList<>();
        }
        bookings.add(booking);
        booking.setRoom(this);
        isBoook = true;
        String bookingCode = RandomStringUtils.randomAlphanumeric(10);
        booking.setBookingConfirmationCode(bookingCode);
    }

    public Long getRoomId() {
        return this.id;
    }
}
