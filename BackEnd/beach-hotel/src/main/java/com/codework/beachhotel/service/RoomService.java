package com.codework.beachhotel.service;

import com.codework.beachhotel.exception.InternalServeException;
import com.codework.beachhotel.exception.ResourceNotFoundException;
import com.codework.beachhotel.model.Room;
import com.codework.beachhotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService implements IRoomService {
    private final RoomRepository roomRepository;
    @Override
    public Room addNewRoom(MultipartFile file, String roomType, BigDecimal roomPrice, String description) throws SQLException, IOException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        room.setDescription(description);
        if (!file.isEmpty()) {
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }
        return roomRepository.save(room);
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public List<Room> getAllRoom() {
        return roomRepository.findAll();
    }

    @Override
    public byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException {
        Optional<Room> theroom = roomRepository.findById(roomId);
        if (!theroom.isPresent()) {
            throw new ResourceNotFoundException("Sorry, Room not found!");
        }
        Blob photoBlob = theroom.get().getPhoto();
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    @Override
    public void deleteRoom(Long roomId) {
        Optional<Room> theroom = roomRepository.findById(roomId);
        if (theroom.isPresent()) {
            roomRepository.deleteById(roomId);
        }
    }

    @Override
    public Room updateRoom(Long roomId, String roomType, BigDecimal roomPrice, byte[] photoBytes, String description) {
        Room room = roomRepository.findById(roomId).orElseThrow(()->new ResourceNotFoundException("Sorry, Room not found!"));

        if (roomType != null) room.setRoomType(roomType);
        if(roomPrice != null) room.setRoomPrice(roomPrice);
        if (roomType != null) room.setDescription(description);
        if(photoBytes != null && photoBytes.length > 0) {
            try{
                room.setPhoto(new SerialBlob(photoBytes));
            }catch (SQLException ex) {
                throw new InternalServeException("Sorry, Room not found!");
            }
        }
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> getRoomById(Long roomId) {
        return Optional.of(roomRepository.findById(roomId).get());
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate,checkOutDate,roomType);
    }
}
