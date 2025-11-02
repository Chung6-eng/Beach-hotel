package com.codework.beachhotel.controller;

import com.codework.beachhotel.model.User;
import com.codework.beachhotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    // Lấy danh sách tất cả người dùng
    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }

    // Lấy thông tin user theo email
    @GetMapping("/{email}")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER')")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
        try {
            User theUser = userService.getUser(email);
            return ResponseEntity.ok(theUser);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user");
        }
    }

    // Xóa user theo email hoặc id (nên thống nhất)
    @DeleteMapping("/delete/{email}")
    @PreAuthorize("hasRole('MANAGER') or #email == authentication.name")
    public ResponseEntity<String> deleteUser(@PathVariable("email") String email) {
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok("User deleted successfully");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user");
        }
    }

}
