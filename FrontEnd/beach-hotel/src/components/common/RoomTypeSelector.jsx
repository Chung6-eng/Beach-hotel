import { useEffect, useState } from "react";
import { getRoomTypes } from "../utils/ApiFunctions";

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
  const [roomTypes, setRoomType] = useState([]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");

  useEffect(() => {
    getRoomTypes()
      .then((data) => {
        console.log("Room types from API:", data);
        if (Array.isArray(data)) setRoomType(data);
      })
      .catch((err) => console.error("Failed to fetch room types", err));
  }, []);

  const handleNewRoomTypeInputChange = (e) => setNewRoomType(e.target.value);

  const handleAddNewRoomType = () => {
    if (newRoomType.trim() !== "") {
      setRoomType([...roomTypes, newRoomType]);
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
    }
  };

  return (
    <div>
      <select
        required
        className="form-select"
        name="roomTypes"
        value={newRoom.roomTypes}
        onChange={(e) => {
          if (e.target.value === "Add New") {
            setShowNewRoomTypeInput(true);
          } else {
            handleRoomInputChange(e);
          }
        }}
      >
        <option value="">Select A Room Type</option>
        <option value="Add New">➕ Add New Room Type</option>
        {roomTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      {showNewRoomTypeInput && (
        <div className="mt-2 input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Enter new room type"
            value={newRoomType}
            onChange={handleNewRoomTypeInputChange}
          />
          <button className="btn btn-primary" type="button" onClick={handleAddNewRoomType}>
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomTypeSelector;
