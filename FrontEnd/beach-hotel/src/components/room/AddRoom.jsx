import React, { useState } from 'react'
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link } from "react-router-dom";

const AddRoom = () => {
    const [newRoom, setNewRoom] = useState({
        photo: null,
        roomTypes: "",
        roomPrice: "",
        roomDescription: ""  // 🟢 thêm description
    });

    const [imagePreview, setImagePreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRoomInputChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        if (name === "roomPrice") {
            if (!isNaN(value)) {
                value = parseInt(value, 10);
            } else {
                value = "";
            }
        }

        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setNewRoom({ ...newRoom, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting room data:", newRoom);

        try {
            if (!newRoom.photo) {
                setErrorMessage("Please select a photo before submitting.");
                return;
            }

            const response = await addRoom(
                newRoom.photo,
                newRoom.roomTypes,
                newRoom.roomPrice,
                newRoom.roomDescription
            );

            if (response) {
                setSuccessMessage("A new room was added successfully!");
                setNewRoom({ photo: null, roomTypes: "", roomPrice: "", roomDescription: "" });
                setImagePreview("");
                setErrorMessage("");
            } else {
                setErrorMessage("Error adding new room. Please try again.");
            }
        } catch (error) {
            setErrorMessage(error.message || "Unexpected error occurred");
        }

        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    return (
        <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="text-start mt-5 mb-2">Add New Room</h2>

                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Room Type */}
                        <div className="mb-3 row">
                            <label htmlFor="roomType" className="col-sm-3 col-form-label text-start">
                                Room Type
                            </label>
                            <div>
                                <RoomTypeSelector
                                    handleRoomInputChange={handleRoomInputChange}
                                    newRoom={newRoom}
                                />
                            </div>
                        </div>

                        {/* Room Price */}
                        <div className="mb-3 row">
                            <label htmlFor="roomPrice" className="col-sm-3 col-form-label text-start">
                                Room Price
                            </label>
                            <div>
                                <input
                                    className="form-control"
                                    required
                                    type="number"
                                    id="roomPrice"
                                    name="roomPrice"
                                    value={newRoom.roomPrice}
                                    onChange={handleRoomInputChange}
                                />
                            </div>
                        </div>

                        {/* 🟢 Room Description */}
                        <div className="mb-3 row">
                            <label htmlFor="roomDescription" className="col-sm-3 col-form-label text-start">
                                Description
                            </label>
                            <div>
                                <textarea
                                    className="form-control"
                                    id="roomDescription"
                                    name="roomDescription"
                                    rows="3"
                                    placeholder="Enter room description..."
                                    value={newRoom.roomDescription}
                                    onChange={handleRoomInputChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Room Photo */}
                        <div className="mb-3 row">
                            <label htmlFor="photo" className="col-sm-3 col-form-label text-start">
                                Room Photo
                            </label>
                            <div>
                                <input
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    className="form-control"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview Room"
                                        className="mb-3"
                                        style={{ maxWidth: "400px", maxHeight: "400px" }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-start mt-2">
                            <Link to={"/existing-rooms"} className="btn btn-outline-info me-2">
                                Back
                            </Link>
                            <button className="btn btn-outline-primary" type="submit">
                                Save Room
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddRoom;
