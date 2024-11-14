const Case = require('../models/case.model');

// Create a new Case
exports.create = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const caseData = {
    title: req.body.title,
  };

  try {
    const data = await Case.create(caseData);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all Cases
exports.findAll = async (req, res) => {
  try {
    const cases = await Case.findAll();
    res.send(cases);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve Case by Id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const caseData = await Case.findByPk(id);
    if (caseData) {
      res.send(caseData);
    } else {
      res.status(404).send({ message: "Case not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Case by id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Case.destroy({ where: { id: id } });
    if (num == 1) {
      res.send({ message: "Case was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Case!` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Edit a Case by id
// exports.update = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const num = await Case.update(req.body, { where: { id: id } });
//     if (num == 1) {
//       res.send({ message: "Case was updated successfully." });
//     } else {
//       res.send({ message: `Cannot update Case.` });
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

