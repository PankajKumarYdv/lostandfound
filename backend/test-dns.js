const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.findrly.5r1kaaj.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err);
    } else {
      console.log("SRV Records:", addresses);
    }
  }
);