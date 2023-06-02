const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @Des Get all Contacts
// @route Get /api/contacts
// @acess private
const getContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.User.id });
  res.status(200).json(contacts);
});

// @Des   get Contact by id
// @route  get /api/contacts/:id
// @acess private
const getContactId = asyncHandler(async (req, res) => {
  // contact naam ka ek variable bnaya , agar vo contact mila nhi db mai to error throw kro  vrna vo variable return .
  // and yaa Contact ek model hai , mtlb format hai db ka..
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

// @Des  update Contact
// @route  Put /api/contacts/:id
// @acess private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() != req.user_id) {
    res.status(404);
    throw new Error("User don't have permission to change other user contacts");
  }
  const updatedcontact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedcontact);
});

// @Des     Delete new Contact
// @route  Delete /api/contacts/:id
// @acess private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() != req.user_id) {
    res.status(404);
    throw new Error("User don't have permission to delete other user contacts");
  }
  await Contact.deleteOne({ _id: req.params.id });

  // res.status(200).json({ message: `Delete contact for ${req.params.id}` });
  res.status(200).json(contact);
});

// @Des     Create new Contact
// @route  POST /api/contacts
// @acess private
const createContact = asyncHandler(async (req, res) => {
  console.log("The req body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.User.id,
  });
  res.status(201).json(contact);
});

module.exports = {
  getContact,
  createContact,
  deleteContact,
  updateContact,
  getContactId,
};
