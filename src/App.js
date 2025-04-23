import React, { useState, useEffect } from "react";

const vacationSlots = [
  "NOV01 - NOV14",
  "NOV15 - NOV28",
  "NOV29 - DEC12",
  "DEC13 - DEC26",
  "DEC27 - JAN09",
  "JAN10 - JAN23",
  "JAN24 - FEB06",
  "FEB07 - FEB20",
  "FEB21 - MAR06",
  "MAR07 - MAR20",
  "MAR21 - APR03",
];

const MAX_BOOKINGS_PER_SLOT = 3;
const ADMIN_CREDENTIALS = { username: "admin", password: "securepass" };

export default function VacationBooking() {
  const [bookings, setBookings] = useState({});
  const [crewName, setCrewName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load bookings from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingsParam = params.get("bookings");
    if (bookingsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(bookingsParam));
        setBookings(parsed);
      } catch (err) {
        console.error("Invalid bookings in URL", err);
      }
    }
  }, []);

  // Update URL with current bookings
  const updateURL = (updatedBookings) => {
    const params = new URLSearchParams(window.location.search);
    params.set("bookings", encodeURIComponent(JSON.stringify(updatedBookings)));
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const bookSlot = (slot) => {
    if (!crewName.trim()) return;

    setBookings((prev) => {
      const updated = { ...prev };
      if (!updated[slot]) updated[slot] = [];
      if (updated[slot].length < MAX_BOOKINGS_PER_SLOT) {
        updated[slot].push(crewName);
      }
      updateURL(updated); // sync with URL
      return updated;
    });

    setCrewName("");
    setSelectedSlot(null);
  };

  const handleLogin = () => {
    if (
      login.username === ADMIN_CREDENTIALS.username &&
      login.password === ADMIN_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1024px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Cabin Crew Vacation Booking
      </h1>

      {!isLoggedIn ? (
        <div
          style={{ maxWidth: "400px", margin: "0 auto", marginBottom: "2rem" }}
        >
          <input
            type="text"
            placeholder="Admin Username"
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button
            onClick={handleLogin}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            Login as Admin
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
        >
          Logout Admin
        </button>
      )}

      {!isLoggedIn && (
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Enter your 3 letter code"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
            style={{ flex: 1, marginRight: "1rem", padding: "0.5rem" }}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {vacationSlots.map((slot) => (
          <div
            key={slot}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              {slot}
            </h2>
            {isLoggedIn ? (
              <ul style={{ fontSize: "0.875rem", paddingLeft: "1.25rem" }}>
                {bookings[slot]?.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <>
                {bookings[slot]?.length >= MAX_BOOKINGS_PER_SLOT ? (
                  <p style={{ color: "red", fontWeight: "500" }}>
                    Fully Booked
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedSlot(slot);
                      bookSlot(slot);
                    }}
                    disabled={!crewName}
                    style={{ padding: "0.5rem 1rem", marginTop: "0.5rem" }}
                  >
                    Book
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
