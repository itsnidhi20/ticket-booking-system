INSERT INTO venues (name, city, address, capacity)
VALUES
('DY Patil Stadium', 'Mumbai', 'Nerul, Navi Mumbai', 55000),
('Phoenix Auditorium', 'Pune', 'Viman Nagar', 5000);

INSERT INTO events
(title, description, venue_id, event_date, start_time, end_time, price)
VALUES
(
'Coldplay Concert',
'Music Concert',
1,
'2026-08-20',
'18:00',
'22:00',
4999.00
),
(
'Stand-up Comedy',
'Comedy Night',
2,
'2026-08-25',
'19:00',
'21:00',
799.00
);