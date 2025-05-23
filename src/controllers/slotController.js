const SlotService = require('../services/slotService');

class SlotController {
    // Get all slots
    async getAllSlots(req, res) {
        console.log('Fetching all slots');
        try {
            const slots = await SlotService.getAllSlots();
            if (!slots) {
                return res.status(404).json({ message: 'Slots not found' });
            }else if (slots.length === 0) {
                return res.status(404).json({ message: 'Slots not found' });
            }
            res.status(200).json(slots);
        } catch (error) {
            res.status(500).json({ message: `Error fetching slots ${error}`, error });
        }
    }

    // Get slot by ID
    async getSlotById(req, res) {
        try {
            const slot = await SlotService.getSlotById(req.params.id);
            if (!slot) {
                return res.status(404).json({ message: 'Slot not found' });
            }
            res.status(200).json(slot);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching slot', error });
        }
    }

    // Create a new slot
    async createSlot(req, res) {
        console.log("Save bookign details to DB");
        try {
            const newSlot = await SlotService.createSlot(req.body);
            if(req.body == null || req.body == undefined) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            if (newSlot == "USER_NOT_FOUND") {
                return res.status(400).json({ message: `Error creating slot :: ${newSlot}` });   
            }else if(newSlot == "SLOT_ALREADY_EXISTS") {
                return res.status(400).json({ message: `Error creating slot :: ${newSlot}` });
            }
            res.status(201).json(newSlot);
        } catch (error) {
            res.status(500).json({ message: `Error creating slot ${error}`, error });
        }
    }

    // Update a slot
    async updateSlot(req, res) {
        try {
            const updatedSlot = await SlotService.updateSlot(req.params.id, req.body);
            if(req.body == null || req.body == undefined) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            if(updatedSlot == "SLOT_NOT_FOUND") {
                return res.status(404).json({ message: 'Slot not found' });
            }else if (!updatedSlot) {
                return res.status(200).json({ message: 'Nothing to update' });
            }
            res.status(200).json(updatedSlot);
        } catch (error) {
            res.status(500).json({ message: `Error updating slot ${error}`, error });
        }
    }

    

    // Delete a slot
    async deleteSlot(req, res) {
        try {
            const deletedSlot = await SlotService.deleteSlot(req.params.id);
            console.log("Deleted Slot",deletedSlot);
            if(deletedSlot == "SLOT_NOT_FOUND") {
                return res.status(404).json({ message: 'Slot not found' });
            }else if (!deletedSlot) {
                return res.status(404).json({ message: 'Slot not found' });
            }else if(deletedSlot == "SLOT_BOOKED") {
                return res.status(404).json({ message: 'Slot is booked' });
            }else if(deletedSlot == "BOOKING_EXISTS") {
                return res.status(404).json({ message: 'Unable to delete, booking exists on this slot' });
            }
            res.status(200).json({ message: 'Slot deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error deleting slot ${error}`, error });
        }
    }
}

module.exports = new SlotController();