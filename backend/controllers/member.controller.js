const Member = require('../models/member.model');

// Create a new Member
exports.create = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.birthDate || !req.body.country || !req.body.city) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const birthDate = new Date(req.body.birthDate);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    return res.status(400).send({ message: "Member must be at least 18 years old." });
  }

  const member = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
    country: req.body.country,
    city: req.body.city,
  };

  try {
    const data = await Member.create(member);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all Members
exports.findAll = async (req, res) => {
  const sort = req.query.sort;
  if (sort === 'birthday') {
    return this.findSortedByBirthday(req, res);
  }
  try {
    const members = await Member.findAll();
    res.send(members);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve Member by Id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const member = await Member.findByPk(id);
    if (member) {
      res.send(member);
    } else {
      res.status(404).send({ message: "Member not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a Member by id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Member.destroy({ where: { id: id } });
    if (num == 1) {
      res.send({ message: "Member was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Member!` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all Members whose birthday is today
exports.findBirthdayToday = async (req, res) => {
  try {
    const today = new Date();
    const members = await Member.findAll();
    const birthdayMembers = members.filter(member => {
      const birthDate = new Date(member.birthDate);
      return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    });
    res.send(birthdayMembers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Edit a Member by id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Member.update(req.body, { where: { id: id } });
    if (num == 1) {
      res.send({ message: "Member was updated successfully." });
    } else {
      res.send({ message: `Cannot update Member.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve Members sorted by closest to date birthdays (today)
exports.findSortedByBirthday = async (req, res) => {
  try {
    const members = await Member.findAll();
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    members.sort((a, b) => {
      const aBirthDate = new Date(a.birthDate);
      const bBirthDate = new Date(b.birthDate);

      aBirthDate.setFullYear(today.getFullYear());
      bBirthDate.setFullYear(today.getFullYear());

      // If the birthday has already passed this year, set it to next year
      if (aBirthDate < today) aBirthDate.setFullYear(today.getFullYear() + 1);
      if (bBirthDate < today) bBirthDate.setFullYear(today.getFullYear() + 1);

      const aDiff = Math.abs(aBirthDate.getTime() - today.getTime());
      const bDiff = Math.abs(bBirthDate.getTime() - today.getTime());

      return aDiff - bDiff;
    });

    res.send(members);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

