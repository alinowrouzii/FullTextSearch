const express = require('express');
const { getContact, createContact, updateContact, deleteContact, ordinaryGetContact } = require('./../controllers/contactController.js')
const router = express.Router();


router.get('/', getContact);
router.get('/ordinary/', ordinaryGetContact);
router.post('/', createContact);

router.patch('/', updateContact);
router.delete('/:contact_id', deleteContact);

module.exports = router;