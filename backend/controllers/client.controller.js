const Client = require('../models/client.model');

// Create a new Client
exports.create = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.birthDate || !req.body.country || !req.body.city) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const client = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    birthDate: req.body.birthDate,
    country: req.body.country,
    city: req.body.city,
  };

  try {
    const data = await Client.create(client);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all Clients
exports.findAll = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.send(clients);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve Client by Id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findByPk(id);
    if (client) {
      res.send(client);
    } else {
      res.status(404).send({ message: "Client not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Client by id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Client.destroy({ where: { id: id } });
    if (num == 1) {
      res.send({ message: "Client was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Client!` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Edit a Client by id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Client.update(req.body, { where: { id: id } });
    if (num == 1) {
      res.send({ message: "Client was updated successfully." });
    } else {
      res.send({ message: `Cannot update Client.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
