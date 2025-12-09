package com.codework.beachhotel.controller;

import com.codework.beachhotel.service.RevenueService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("api/admin")
@CrossOrigin("*")
@PreAuthorize("hasRole('MANAGER')")
public class RevenueController {

    private final RevenueService revenueService;

    public RevenueController(RevenueService revenueService) {
        this.revenueService = revenueService;
    }

    @GetMapping("/revenue")
    public Map<String, Object> getAllRevenue() {
        return revenueService.getRevenueStats();
    }

    @GetMapping("/monthly-revenue")
    public Double getMonthlyRevenue(@RequestParam int month, @RequestParam int year) {
        return revenueService.getMonthlyRevenue(month, year);
    }

    @GetMapping("/monthly-revenue-details")
    public Map<String, Object> getMonthlyRevenueDetails(
            @RequestParam int month,
            @RequestParam int year) {
        return revenueService.getMonthlyRevenueDetails(month, year);
    }

}