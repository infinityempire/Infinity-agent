function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST supported" });
    return true;
  }
  var body = req.body || {};
  var msg = body.message || "no message";
  res.status(200).json({ status: "success", reply: "🤖 Agent received: " + msg });
  return true;
}
module.exports = handler;
