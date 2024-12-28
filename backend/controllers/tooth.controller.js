const Tooth = require('../models/tooth.model');

// Create a new Tooth
exports.create = async (req, res) => {
  if (!req.body.number || !req.body.caseId) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const tooth = {
    number: req.body.number,
    problems: req.body.problems || '',
    caseId: req.body.caseId,
  };

  try {
    const data = await Tooth.create(tooth);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// Retrieve all Teeth by CaseId
exports.findByCaseId = async (req, res) => {
  const caseId = req.params.caseId;

  try {
    const teeth = await Tooth.findAll({ where: { caseId } });
    res.send(teeth);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}