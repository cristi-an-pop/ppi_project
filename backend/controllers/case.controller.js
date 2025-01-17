const Case = require('../models/case.model');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const sequelize = require('../config/db.config');
const Tooth = require('../models/tooth.model');
const FormData = require('form-data');
const axios = require('axios');

const RISK_LEVELS = {
  0: "Implant",    // Implant
  1: "Prosthetic restoration",    // Prosthetic restoration
  2: "Obturation",    // Obturation
  3: "Endodontic treatment",    // Endodontic treatment
  12: "Orthodontic device",   // Orthodontic device
  13: "Surgical device",   // Surgical device
  4: "Carious lesion", // Carious lesion
  5: "Bone resorbtion", // Bone resorbtion
  6: "Impacted tooth", // Impacted tooth
  10: "Apical srugery",// Apical surgery
  7: "Apical periodontitis",   // Apical periodontitis
  8: "Root fragment",   // Root fragment
  9: "Furcation lesion",   // Furcation lesion
  11: "Root resorption"   // Root resorption
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Return the file path that will be stored in the Case model
    res.status(201).json({
      filepath: req.file.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
};


exports.update = async (req, res) => {
  try {
    const dbCase = await Case.findByPk(req.params.id);
    if (!dbCase) {
      return res.status(404).send('Case not found');
    }
    
    await dbCase.update(req.body);
    res.json(dbCase);
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).send('Error updating case');
  }
};


exports.getImage = async (req, res) => {
  try {
    const dbCase = await Case.findByPk(req.params.id);
    if (!dbCase || !dbCase.image) {
      return res.status(404).send('Image not found');
    }
    res.sendFile(path.resolve(dbCase.image));
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Error retrieving image');
  }
};


// Create a new Case
exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, clientId, image } = req.body;
    const newCase = await Case.create({ title, clientId, image }, { transaction });

    // Read the image file from the file path
    const imagePath = path.resolve(image);
    const imageFile = fs.createReadStream(imagePath);

    // Call the combine endpoint of the AI model
    const formData = new FormData();
    formData.append('image', imageFile);

    const aiResponse = await axios.post('http://localhost:5000/api/combine', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const { predictions } = aiResponse.data;

    // Initialize an array with 32 teeth objects
    const teethToCreate = Array.from({ length: 32 }, (_, index) => ({
      caseId: newCase.id,
      number: index + 1,
      class: null,
      problem: -1,
      x: null,
      y: null,
      width: null,
      height: null,
      confidence: null,
      description: ''
    }));

    // Update the detected teeth with the data from the AI response
    predictions.forEach(prediction => {
      console.log(prediction.bbox)
      const toothIndex = prediction.class - 1;
      if (toothIndex >= 0 && toothIndex < 32) {
        teethToCreate[toothIndex] = {
          ...teethToCreate[toothIndex],
          class: prediction.class,
          number: prediction.class,
          problem: prediction.vulnerabilities[0]?.class || 99,
          x1: prediction.bbox[0],
          y1: prediction.bbox[1],
          x2: prediction.bbox[2],
          y2: prediction.bbox[3],
          confidence: prediction.confidence,
          description: RISK_LEVELS[prediction.vulnerabilities[0]?.class] + " | " || ''
        };
      }
    });

    await Tooth.bulkCreate(teethToCreate, { transaction });
    await transaction.commit();

    const caseWithTeeth = await Case.findByPk(newCase.id, {
      include: [{
        model: Tooth,
        as: 'teeth'
      }]
    });

    res.status(201).json({
      case: caseWithTeeth
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating case with teeth:', error);
    res.status(500).json({
      message: 'Error creating case with teeth',
      error: error.message
    });
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
    const caseData = await Case.findByPk(id, {
      include: [{
        model: Tooth,
        as: 'teeth'
      }]
    });
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

// Get cases by client id
exports.findByClientId = async (req, res) => {
  const clientId = req.query.clientId;
  console.log(clientId);
  try {
    const cases = await Case.findAll({ 
      where: { clientId: clientId },
      include: [{
        model: Tooth,
        as: 'teeth'
      }],
      order: [
      ['createdAt', 'DESC'] // Most recent cases first
    ]
  });

    res.status(200).send(cases);
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

