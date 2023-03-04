const { pagination } = require("./pagination");



function getCandidatesByEmail(connection,email) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM candidates WHERE email = ?`, [email], (err, data) => {
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

  function getRecruitersById(connection,id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM recruiters WHERE recruiter_id = ?", [id], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0]);
        }
      });
    });
  }

  function getAmdinByEmail(connection,email) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM admin WHERE email = ?", [email], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data[0]);
        }
      });
    });
  }
  
  function getAllCandidates(connection){
    return new Promise((resolve,reject)=>{
      connection.query("Select * from candidates ",(err,result)=>{
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  }

  function getAllRecruiters(connection){
    return new Promise((resolve,reject)=>{
      connection.query("Select * from recruiters ",(err,result)=>{
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  }

  function getAllAppliedJobs(connection){
    return new Promise((resolve,reject)=>{
      connection.query("Select j.title,j.description,ap.candidate_id from appliedJobs ap inner join jobs j on j.job_id=ap.job_id ",(err,result)=>{
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  }


  module.exports={getCandidatesByEmail,getRecruitersByEmail,getAmdinByEmail,getAllAppliedJobs,getAllCandidates,getAllRecruiters,getRecruitersById}