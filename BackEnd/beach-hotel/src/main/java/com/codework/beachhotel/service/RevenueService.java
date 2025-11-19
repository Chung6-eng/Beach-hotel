package com.codework.beachhotel.service;

import com.codework.beachhotel.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RevenueService {

    private final BookingRepository bookingRepository;

    public RevenueService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Double getMonthlyRevenue(int month, int year) {
        Double revenue = bookingRepository.getTotalRevenueByMonth(month, year);
        return revenue != null ? revenue : 0.0;
    }

    public Map<String, Object> getRevenueStats() {

        Map<String, Object> finalResponse = new LinkedHashMap<>();

        List<Object[]> dayData = bookingRepository.getRevenueByDay();
        Map<String, Double> revenueByDay = new LinkedHashMap<>();

        for (Object[] row : dayData) {
            String day = (String) row[0];
            Double total = ((Number) row[1]).doubleValue();
            revenueByDay.put(day, total);
        }

        List<Object[]> monthData = bookingRepository.getRevenueByMonth();
        Map<String, Double> revenueByMonth = new LinkedHashMap<>();

        for (Object[] row : monthData) {
            Integer month = ((Number) row[0]).intValue();
            Double total = ((Number) row[1]).doubleValue();
            revenueByMonth.put("Tháng " + month, total);
        }

        List<Object[]> yearData = bookingRepository.getRevenueByYear();
        Map<String, Double> revenueByYear = new LinkedHashMap<>();

        for (Object[] row : yearData) {
            Integer year = ((Number) row[0]).intValue();
            Double total = ((Number) row[1]).doubleValue();
            revenueByYear.put(String.valueOf(year), total);
        }

        finalResponse.put("byDay", revenueByDay);
        finalResponse.put("byMonth", revenueByMonth);
        finalResponse.put("byYear", revenueByYear);

        return finalResponse;
    }

    public Map<String, Object> getMonthlyRevenueDetails(int month, int year) {
        Map<String, Object> response = new LinkedHashMap<>();

        // Tổng doanh thu tháng
        Double totalRevenue = bookingRepository.getTotalRevenueByMonth(month, year);
        response.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        // Doanh thu theo loại phòng
        List<Object[]> roomData = bookingRepository.getRevenueByRoomType(month, year);
        // Giả sử Object[] = { roomType (String), count (Long), revenue (Double) }

        List<Map<String, Object>> roomTypes = new ArrayList<>();
        for (Object[] row : roomData) {
            Map<String, Object> roomMap = new LinkedHashMap<>();
            roomMap.put("type", (String) row[0]);
            roomMap.put("count", ((Number) row[1]).intValue());
            roomMap.put("revenue", ((Number) row[2]).doubleValue());
            roomTypes.add(roomMap);
        }

        response.put("roomTypes", roomTypes);
        return response;
    }

}
