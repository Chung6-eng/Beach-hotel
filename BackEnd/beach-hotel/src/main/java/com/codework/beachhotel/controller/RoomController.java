package com.codework.beachhotel.controller;

import com.codework.beachhotel.exception.PhotoRetrievalException;
import com.codework.beachhotel.exception.ResourceNotFoundException;
import com.codework.beachhotel.model.BookedRoom;
import com.codework.beachhotel.model.Room;
import com.codework.beachhotel.response.RoomResponse;
import com.codework.beachhotel.service.BookingService;
import com.codework.beachhotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {
    private final IRoomService roomService;
    private final BookingService bookingService;

    @PostMapping("/add/new-room")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<RoomResponse> addNewRoom(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("roomType") String roomType,
            @RequestParam("roomPrice") BigDecimal roomPrice,
            @RequestParam("description") String description) throws SQLException, IOException {
        Room savedRoom = roomService.addNewRoom(photo, roomType,roomPrice,description);
        byte[] photoBytes = photo.getBytes();
        RoomResponse reponse = new RoomResponse(
                savedRoom.getId(),
                savedRoom.getRoomType(),
                savedRoom.getRoomPrice(),
                savedRoom.isBoook(),
                photoBytes,
                savedRoom.getDescription()
        );
        return ResponseEntity.ok(reponse);
    }
    @GetMapping("/room/types")
    @PreAuthorize("permitAll()")
    public List<String> getRoomTypes() {
        return roomService.getAllRoomTypes();
    }

    @GetMapping("/{roomId}/price")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, Object>> getRoomPrice(@PathVariable Long roomId) {
        Optional<Room> roomOpt = roomService.getRoomById(roomId);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Room not found with ID: " + roomId));
        }
        Room room = roomOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", room.getId());
        response.put("roomPrice", room.getRoomPrice());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/all-rooms")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<RoomResponse>> getAllRooms() throws SQLException {
        List<Room> rooms = roomService.getAllRoom();
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room : rooms) {
            RoomResponse roomResponse = getRoomResponse(room);
            byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                roomResponse.setPhoto(base64Photo);
            }
            roomResponses.add(roomResponse);
        }
        return ResponseEntity.ok(roomResponses);
    }


    @DeleteMapping("/delete/room/{roomId}")
    @PreAuthorize("hasRole('MANAGER')")

    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }
    @PutMapping("/update/{roomId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,  @RequestParam(required = false) String roomType,@RequestParam(required = false) BigDecimal roomPrice,@RequestParam(required = false) MultipartFile photo, String description) throws IOException, SQLException {
        byte[] photoBytes = photo != null && !photo.isEmpty()?
                photo.getBytes() : roomService.getRoomPhotoByRoomId(roomId);
        Blob photoBlob = photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
        Room theRoom = roomService.updateRoom(roomId,roomType,roomPrice,photoBytes,description);
        theRoom.setPhoto(photoBlob);
        RoomResponse roomResponse = getRoomResponse(theRoom);
        return ResponseEntity.ok(roomResponse);
}

    @GetMapping("/room/{roomId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable Long roomId) {
        Optional<Room> theRoom = roomService.getRoomById(roomId);
        return theRoom.map(room -> {
            RoomResponse roomResponse = getRoomResponse(room);
            return ResponseEntity.ok(Optional.of(roomResponse));
        }).orElseThrow(()->new ResourceNotFoundException("Room not found"));
    }

    @GetMapping("/available-rooms")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(@RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate, @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate, @RequestParam("roomType")  String roomType) throws SQLException {
        List<Room> availabelRooms = roomService.getAvailableRooms(checkInDate,checkOutDate,roomType);
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room : availabelRooms) {
            byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
            if(photoBytes != null && photoBytes.length > 0) {
                String photoBase64 = Base64.getEncoder().encodeToString(photoBytes);
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setPhoto(photoBase64);
                roomResponses.add(roomResponse);
            }
        }
        if (roomResponses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(roomResponses);
        }
    }



    private RoomResponse getRoomResponse(Room room) {
        List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());
        byte[] photoBytes = null;
        Blob photoBlob = room.getPhoto();
        if (photoBlob != null) {
            try{
                photoBytes = photoBlob.getBytes(1,(int) photoBlob.length());
            }catch (SQLException e){
                throw new PhotoRetrievalException("Error retrieving photo");

            }
        }
        return new RoomResponse(room.getId(),room.getRoomType(),
                room.getRoomPrice(), room.isBoook(),
                photoBytes,room.getDescription());
    }

    private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingService.getAllBookingsByRoomId(roomId);
    }
}
