function handler(req, res) {
  res.status(200).json({ status: "ok", message: "Infinity Agent backend alive" });
  return true;
}
module.exports = handler;
