package com.codework.beachhotel.repository;

import com.codework.beachhotel.model.BookedRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookedRoom, Long> {

    List<BookedRoom> findByRoomId(Long roomId);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> findByGuestEmail(String email);
    // Doanh thu theo ngày trong tuần
    @Query("""
        SELECT FUNCTION('DAYNAME', b.checkInDate) AS dayName,
               SUM(b.totalPayment) AS totalRevenue
        FROM BookedRoom b
        GROUP BY FUNCTION('DAYNAME', b.checkInDate)
        """)
    List<Object[]> getRevenueByDay();

    // Doanh thu theo tháng
    @Query("""
        SELECT FUNCTION('MONTH', b.checkInDate) AS month,
               SUM(b.totalPayment) AS totalRevenue
        FROM BookedRoom b
        GROUP BY FUNCTION('MONTH', b.checkInDate)
        """)
    List<Object[]> getRevenueByMonth();

    // Doanh thu theo năm
    @Query("""
        SELECT FUNCTION('YEAR', b.checkInDate) AS year,
               SUM(b.totalPayment) AS totalRevenue
        FROM BookedRoom b
        GROUP BY FUNCTION('YEAR', b.checkInDate)
        """)
    List<Object[]> getRevenueByYear();

    @Query("SELECT SUM(b.totalPayment) FROM BookedRoom b WHERE MONTH(b.checkInDate) = :month AND YEAR(b.checkInDate) = :year")
    Double getTotalRevenueByMonth(int month, int year);

    @Query("""
    SELECT r.roomType AS roomType, COUNT(b.bookingId) AS count, SUM(b.totalPayment) AS revenue
    FROM BookedRoom b
    JOIN b.room r
    WHERE FUNCTION('MONTH', b.checkInDate) = :month
      AND FUNCTION('YEAR', b.checkInDate) = :year
    GROUP BY r.roomType
    """)
    List<Object[]> getRevenueByRoomType(int month, int year);

    @Query("SELECT COUNT(b) > 0 FROM BookedRoom b " +
            "WHERE b.room.id = :roomId " +
            "AND b.guestEmail = :email " +
            "AND b.checkOutDate > :checkIn " +
            "AND b.checkInDate < :checkOut")
    boolean existsDuplicateBooking(
            @Param("roomId") Long roomId,
            @Param("email") String email,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);



}
