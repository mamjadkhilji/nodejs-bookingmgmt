const express = require('express');

const app = express();

const slotController = require('../controllers/slotController');
const adminAuthenticateMiddleware = require('../middleware/adminMiddleware');
function routes(){

const slotRouter = express.Router();   

// Get all slots
/**
 * @swagger
 * /slots:
 *   get:
 *     summary: Get all slots
 *     description: Retrieve a list of all slots
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
slotRouter.route('/').get(adminAuthenticateMiddleware,slotController.getAllSlots);

/**
 * @swagger
 * /slots/{id}:
 *   get:
 *     summary: Get slot by ID
 *     description: Retrieve a specific slot by its ID
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the slot to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slot not found
 */
slotRouter.route('/:id').get(adminAuthenticateMiddleware,slotController.getSlotById);

/**
 * @swagger
 * /slots:
 *   post:
 *     summary: Create new slot
 *     description: Create a new slot
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       201:
 *         description: Slot created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
slotRouter.route('/').post(adminAuthenticateMiddleware,slotController.createSlot);

/**
 * @swagger
 * /slots/{id}:
 *   put:
 *     summary: Update slot
 *     description: Update an existing slot
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the slot to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slot'
 *     responses:
 *       200:
 *         description: Slot updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slot not found
 *       400:
 *         description: Bad request
 */
slotRouter.route('/:id').put(adminAuthenticateMiddleware,slotController.updateSlot);

/**
 * @swagger
 * /slots/{id}:
 *   delete:
 *     summary: Delete slot
 *     description: Delete an existing slot
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the slot to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slot deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slot not found
 */
slotRouter.route('/:id').delete(adminAuthenticateMiddleware,slotController.deleteSlot);
    return slotRouter;   
}

module.exports = routes;