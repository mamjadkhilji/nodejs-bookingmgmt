const BookingService = require('../services/bookingService');

class BookingController {
    // Get all bookings
    async getAllBookings(req, res) {
        console.log('Fetching all bookings');
        try {
             const userLogin = req.headers.loginid;
            const bookings = await BookingService.getAllBookings(userLogin);
            if (!bookings) {
                return res.status(404).json({ message: 'Bookings not found' });
            }else if (bookings.length === 0) {
                return res.status(404).json({ message: 'Bookings not found' });
            }
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: `Error fetching bookings ${error}`, error });
        }
    }

    // Get booking by ID
    async getBookingById(req, res) {
        try {
             const userLogin = req.headers.loginid;
            const booking = await BookingService.getBookingById(userLogin, req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching booking', error });
        }
    }

    // Create a new booking
    async createBooking(req, res) {
        console.log("Save bookign details to DB");
        const userLogin = req.headers.loginid;
        try {
            if(req.body == null || req.body == undefined) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            const newBooking = await BookingService.createBooking(userLogin,req.body);
            if (newBooking == "USER_NOT_FOUND") {
                return res.status(400).json({ message: `Error creating booking :: ${newBooking}` });   
            }else if(newBooking == "BOOKING_ALREADY_EXISTS") {
                return res.status(400).json({ message: `Error creating booking :: ${newBooking}` });
            }else if(newBooking == "SLOT_NOT_FOUND") {
                return res.status(400).json({ message: `Error creating booking :: ${newBooking}` });
            }
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(500).json({ message: `Error creating booking ${error}`, error });
        }
    }

    // Update a booking
    async updateBooking(req, res) {
        try {
            const userLogin = req.headers.loginid;
            if(req.body == null || req.body == undefined) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const updatedBooking = await BookingService.updateBooking(userLogin,req.params.id, req.body);
            if(updatedBooking == "BOOKING_NOT_FOUND") {
                return res.status(404).json({ message: 'Booking not found' });
            }else if (!updatedBooking) {
                return res.status(200).json({ message: 'Nothing to update' });
            }else if(updatedBooking == "SLOT_NOT_FOUND") {
                return res.status(404).json({ message: `Error updating booking :: ${updatedBooking}` });
            }   
            res.status(200).json(updatedBooking);
        } catch (error) {
            res.status(500).json({ message: `Error updating booking ${error}`, error });
        }
    }

     // Patch a booking
    async patchBooking(req, res) {
        try {
            const userLogin = req.headers.loginid;
            if(req.body == null || req.body == undefined) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            const patchedBooking = await BookingService.patchBooking(userLogin,req.params.id, req.body);
            if(patchedBooking == "BOOKING_NOT_FOUND") {
                return res.status(404).json({ message: 'Booking not found' });
            }else if (!patchedBooking) {
                return res.status(404).json({ message: 'Nothing to update' });
            }else if(patchedBooking == "SLOT_NOT_FOUND") {
                return res.status(404).json({ message: `Error patching booking :: ${patchedBooking}` });
            }  
            res.status(200).json(patchedBooking);
        } catch (error) {
            res.status(500).json({ message: `Error patching booking ${error}`, error });
        }
    }

    // Delete a booking
    async deleteBooking(req, res) {
        try {
            const userLogin = req.headers.loginid;
            const deletedBooking = await BookingService.deleteBooking(userLogin,req.params.id);

            if(deletedBooking == "BOOKING_NOT_FOUND") {
                return res.status(404).json({ message: 'Booking not found' });
            }else if (!deletedBooking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error deleting booking ${error}`, error });
        }
    }
}

module.exports = new BookingController();