import React, {useState} from 'react'
import { getRoomById, updateRoom} from "../utils/ApiFunctions"
import { Link, useParams } from "react-router-dom";
import { useEffect } from 'react';
const EditRoom = () => {
  const [room, setRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: "",
    description: ""
  })


  const [successMessage,setSuccessMessage] = useState("")
  const [errorMessage,setErrorMessage] = useState("")
  const [imagePreview,setImagePreview] = useState("")

  const {roomId} = useParams()

  const handleInputChange = (event) => {
        const {name,value} = event.target
          setRoom({...room, [name]: value});
  }

   useEffect(() => {
  const fetchRoom = async () => {
    try {
      const roomData = await getRoomById(roomId);
      setRoom(roomData);

      // Nếu backend trả base64
      if (roomData.photo) {
        setImagePreview(`data:image/jpeg;base64,${roomData.photo}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchRoom();
}, [roomId]);

// Khi upload ảnh mới
const handleImageChange = (e) => {
  const selectedImage = e.target.files[0];
  setRoom({ ...room, photo: selectedImage });

  // Hiển thị ảnh ngay lập tức
  setImagePreview(URL.createObjectURL(selectedImage));
};

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("Submitting room data:", room);

  try {
    const formData = new FormData();
    formData.append("roomType", room.roomType);
    formData.append("roomPrice", room.roomPrice);
    formData.append("description", room.description || "");
    if (room.photo) formData.append("photo", room.photo);

    const updatedRoom = await updateRoom(roomId, formData);

    setSuccessMessage("Room updated successfully!");
    setErrorMessage("");
    setRoom(updatedRoom);

    if (updatedRoom.photo) {
      setImagePreview(`data:image/jpeg;base64,${updatedRoom.photo}`);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("Error updating room");
  }
};

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-4">Edit Room</h3>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Room Type */}
            <div className="mb-3 row">
              <label
                htmlFor="roomType"
                className="col-sm-3 col-form-label hotel-color fw-bold text-start"
              >
                Room Type
              </label>
              <input
                type="text"
                className="form-control"
                id="roomType"
                name="roomType"
                value={room.roomType}
                onChange={handleInputChange}
              />
            </div>

            {/* Room Price */}
            <div className="mb-3 row">
              <label
                htmlFor="roomPrice"
                className="col-sm-3 col-form-label hotel-color fw-bold text-start"
              >
                Room Price
              </label>
              <input
                type="number"
                className="form-control"
                id="roomPrice"
                name="roomPrice"
                value={room.roomPrice}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 row">
                            <label htmlFor="Description" className="col-sm-3 col-form-label text-start">
                                Description
                            </label>
                            <div>
                                <textarea
                                    className="form-control"
                                    id="roomDescription"
                                    name="description"
                                    rows="3"
                                    placeholder="Enter room description..."
                                    value={room.description ?? ""}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

            {/* Room Photo */}
            <div className="mb-3 row">
              <label
                htmlFor="photo"
                className="col-sm-3 col-form-label hotel-color fw-bold text-start"
              >
                Room Photo
              </label>
              <input
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="mt-3 text-center">
                  <img
                  src={imagePreview} 
                  alt="Room preview"
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                  />
                </div>
)}

            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/existing-rooms"
                className="btn btn-outline-info"
              >
                Back
              </Link>
              <button type="submit" className="btn btn-warning">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;