function getCandidatesByEmail(connection,email) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM candidates WHERE email = ?", [email], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0]);
        }
      });
    });
  }

  function getRecruitersByEmail(connection,email) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM recruiters WHERE email = ?", [email], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0]);
        }
      });
    });
  }
  module.exports={getCandidatesByEmail,getRecruitersByEmail}