const logService = require("../models/services_log.js");




exports.createlog = async (req, res) => {
  try {
    /// here
    const body = req?.body;
    const val = validateRequest(body, [
      "log",
     
    ]);
    if (val)
      return res.status(400).send({
        message: val
      });
      
      const Exist = await logService.getlogByID(body.logID);

    if (Exist)
      return res.status(400).send({ message: "Log already registered" })

  } catch (err) {
    console.log(err);
    return res.send(500);
  }
};
