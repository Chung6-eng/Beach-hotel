import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  return (
    <Col key={room.id} className='mb-4' xs={12}>
        <Card>
            <Card.Body className="d-flex flex-wrap align-items-center">
                <div className='flex-shrink-0 mr-3 mb-3 mb-md-0'>
                    <Link to={`/book-room/${room.id}`}>
                    {room.photo && (
                        <Card.Img 
                        src={`data:image/png;base64, ${room.photo}`}
                        alt='Room Photo'
                        style={{width:"100%", maxWidth: "200px", height :"auto"}}
                        />
                    )}

                    </Link>
                </div>
                <div className='flex-grow-1 ms-3 px-5'>
                    <Card.Title className='hotel-color mb-1'>{room.roomType}</Card.Title>
                    <Card.Subtitle className='room-price mb-1'>{room.roomPrice} / night</Card.Subtitle>
                    <Card.Text className='hotel-color mb-0'>
                        Some room information goes here for the guest to read through
                    </Card.Text>
                </div>

                <div className='flex-shrink-0 mt-3'>
                    <Link to={`/book-room/${room.id}`}>
                        <button className="btn btn-hotel">
                        Book Now
                    </button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    </Col>
  );
};

export default RoomCard;
