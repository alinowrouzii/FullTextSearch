const express = require('express');
const { getContact, createContact, updateContact, deleteContact } = require('./../controllers/contactController.js')
const router = express.Router();


router.get('/', getContact);
router.post('/', createContact);

router.put('/', updateContact);
router.delete('/:contact_id', deleteContact);

module.exports = router;