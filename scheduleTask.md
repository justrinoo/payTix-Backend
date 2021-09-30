Schedule Task

- Register Full Field => ACCEPTED
- Login full field and token => ACCEPTED
- Update Password => ACCEPTED
- Update Profile => ACCEPTED
- Get User by Id User => ACCEPTED
- Dashboard Profile => Request : movieId,location,premiere => ACCEPTED
- Handle Multer = - Limit - Exentions File
- Refresh Token => Optional
  Implementasi Redis
  -Schedule => jika ada join 2 table maka keywoardnya bukan get lagi
  -Booking(OPTIONAL)

  VERIVIKASI EMAIL

- REGISTER FIELD => status,image default status "not active"
- Veriv email

QUERY DASHBOARD : SELECT MONTH(b.createdAt) as month, SUM(b.totalPayment) as total FROM booking b JOIN schedule ON b.scheduleId=schedule.id_schedule WHERE b.movieId = 11 AND schedule.location LIKE "%jak%" AND schedule.premiere LIKE "%eb%" AND YEAR(b.createdAt) = YEAR(CURDATE()) GROUP BY month(b.createdAt)

SELECT b.dateBooking, SUM(b.totalPayment)
FROM booking b
GROUP BY b.dateBooking
HAVING SUM(b.totalPayment)
