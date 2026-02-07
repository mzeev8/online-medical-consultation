"use client";

import VideoCall from "@/components/VideoCall";
import { useAuth } from "@/context/AuthContext";
import { use, useEffect, useState } from "react";

export default function RoomPage({ searchParams }) {
    const { roomId, userId } = use(searchParams);
    const [isLoading, setLoading] = useState(true);
    const [isUnauthorized, setUnauthorized] = useState(false);
    const [roomConfirmed, setRoomConfirmed] = useState(false);
    const [error, setError] = useState(null);
    const { user, authInitialized } = useAuth();

    useEffect(() => {
        setLoading(true);
        const fetchRoomDetails = async () => {
            if (!authInitialized) {
                setLoading(false);
                return;
            }

            if (!user) {
                setLoading(false);
                return;
            }

            if (!roomId || !userId) {
                setError("Invalid room ID or user ID");
                setLoading(false);
                return;
            }

            const response = await fetch(
                // room id is the appointment id
                `${process.env.NEXT_PUBLIC_API_URL}/appointments/${roomId}?fill=both`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                console.error(
                    "Error fetching room details:",
                    response.statusText
                );
                setError(response.statusText);
                setLoading(false);
                return;
            }

            const data = await response.json();

            if (data.status === "confirmed") {
                setRoomConfirmed(true);
                if (!data.patient || !data.doctor) {
                    setError("Invalid appointment data");
                    setLoading(false);
                    return;
                }

                if (
                    !(
                        data.patient.user_id === user.uid ||
                        data.doctor.user_id === user.uid
                    )
                ) {
                    setUnauthorized(true);
                    setLoading(false);
                    return;
                }
            } else {
                setRoomConfirmed(false);
                setLoading(false);
            }

            setLoading(false);
        };

        fetchRoomDetails();
    }, [roomId, userId, authInitialized]);

    if (isLoading || !authInitialized) {
        return <div className="room-container">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="room-container">
                <h1>Unauthorized</h1>
                <p>Please log in to access the room.</p>
            </div>
        );
    }

    if (isUnauthorized) {
        return (
            <div className="room-container">
                <h1>Unauthorized</h1>
                <p>You are not authorized to access this room.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-container">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!roomConfirmed) {
        return (
            <div className="room-container">
                <h1>Room Not Confirmed</h1>
                <p>The room is not confirmed yet.</p>
            </div>
        );
    }

    return (
        <div className="room-container">
            <VideoCall roomId={roomId} userId={userId} />
        </div>
    );
}
