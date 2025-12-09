package com.codework.beachhotel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookedRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @Column(name = "check_In")
    private LocalDate checkInDate;

    @Column(name = "check_Out")
    private LocalDate checkOutDate;

    @Column(name = "guest_FullName")
    private String guestFullName;

    @Column(name = "guest_Email")
    private String guestEmail;

    @Column(name = "adults")
    private int numberOfAdults;

    @Column(name = "children")
    private int numberOfChildren;

    @Column(name = "total_guest")
    private int totalNumberOfGuest;

    @Column(name = "confirmation_Code")
    private String bookingConfirmationCode;

    @Column(name = "total_payment")
    private Float totalPayment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private String status = "PENDING";


    @PrePersist
    @PreUpdate
    public void prePersistOrUpdate() {
        this.totalNumberOfGuest = this.numberOfAdults + this.numberOfChildren;

        if (checkInDate != null && checkOutDate != null && room != null) {
            long days = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
            if (days <= 0) days = 1; // phòng tối thiểu 1 ngày
            this.totalPayment = days * room.getRoomPrice().floatValue();
        }
    }
}

