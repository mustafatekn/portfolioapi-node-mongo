const Message = require("../models/messages");
const { isEmpty, isEmail } = require("../util/validation");

module.exports = {
  getMessages: async (req, res) => {
    await Message.find()
      .select("subject email content createdAt")
      .sort({ createdAt: -1 })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: "Seems like no message found" });
        }
        res.send(result);
        return res.status(200, result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },
  getMessage: async (req, res) => {
    await Message.findById(`${req.params.id}`)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: "Seems like no message found" });
        }
        res.send(result);
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },

  sendMessage: async (req, res) => {
    let errors = {};

    if (isEmpty(req.body.subject)) errors.subject = "subject can not be empty";
    if (isEmpty(req.body.email)) errors.email = "email can not be empty";
    if (!errors.email) {
      if (!isEmail(req.body.email))
        errors.email = "email must be in email format";
    }
    if (isEmpty(req.body.content)) errors.content = "content can not be empty";

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const message = new Message({
      subject: req.body.subject,
      email: req.body.email,
      content: req.body.content,
    });

    await message
      .save()
      .then((result) => {
        res.send(result);
        return res.status(201).json(result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },
};
