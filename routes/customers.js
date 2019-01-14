const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  phone: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  }
});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer was not found');

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  await customer.save();

  res.send(customer);
})

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
   }, {
    new: true
  })

  if (!customer) return res.status(404).send('The customer was not found');

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer was not found');

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).max(25).required(),
    phone: Joi.string().min(3).max(25).required(),
    isGold: Joi.boolean()
  }

  return Joi.validate(customer, schema);
}

module.exports = router;
