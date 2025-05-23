const express = require('express');

const app = express();

const bookingController = require('../controllers/bookingController');
const authenticateMiddleware = require('../middleware/authMiddleware');
function routes(){

const bookingRouter = express.Router();   

// Get all bookings
/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 */
bookingRouter.route('/').get(authenticateMiddleware, bookingController.getAllBookings);

// Get booking by ID 
/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
bookingRouter.route('/:id').get(authenticateMiddleware, bookingController.getBookingById);

// Create new booking
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
bookingRouter.route('/').post(authenticateMiddleware, bookingController.createBooking);

// Update booking
/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
bookingRouter.route('/:id').put(authenticateMiddleware, bookingController.updateBooking);

// Update booking
/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Partially update booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
bookingRouter.route('/:id').patch(authenticateMiddleware, bookingController.patchBooking);

// Delete booking
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
bookingRouter.route('/:id').delete(authenticateMiddleware, bookingController.deleteBooking);

    return bookingRouter;   
}

module.exports = routes;