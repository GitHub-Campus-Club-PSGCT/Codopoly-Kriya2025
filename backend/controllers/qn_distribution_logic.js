const Admin = require('../models/admin');  

const logic= async(req,res) => {
    try{
    const admin = await Admin.findOne({ username: 'Akash' });
    const n = admin.teamCount;
    const alphabets = [];
    for (let i = 65; i <= 90; i++) {
      alphabets.push(String.fromCharCode(i));
    }
  
    const fract = Math.floor(0.6 * n);
    let qns = [];
    for (let i = 0; i < fract; i++) {
      qns.push(alphabets[i]);
    }
  
    let repeating = Array.from({ length: fract }, (_, i) => i);
    for (let i = 0; i < n - fract; i++) {
      const temp = Math.floor(Math.random() * repeating.length);
      qns.push(alphabets[repeating[temp]]);
      repeating.splice(temp, 1);
    }
  
    for (let i = 0; i < 69; i++) {
      qns = qns.sort(() => Math.random() - 0.5);
    }
  
    let second = [...qns];
    second = second.sort(() => Math.random() - 0.5);
    let qns2 = [];
    const qnsCount = n; // preserve original team size
  
    for (let i = 0; i < qnsCount; i++) {
      let temp = qns[i];
      let count = 0;
      // Remove all occurrences of temp from 'second'
      while (second.indexOf(temp) !== -1) {
        second.splice(second.indexOf(temp), 1);
        count++;
      }
      // Use the current length of second to pick a random element
      if (second.length > 0) {
        const r = Math.floor(Math.random() * second.length);
        qns2.push(second[r]);
        second.splice(r, 1);
      } else {
        // Fallback if second is empty
        qns2.push("");
      }
      // Restore removed elements
      for (let j = 0; j < count; j++) {
        second.push(temp);
      }
    }
  
    let third = [...qns];
    let qns3 = [];
    for (let i = 0; i < qnsCount; i++) {
      let temp1 = qns[i];
      let temp2 = qns2[i];
      let count1 = 0;
      let count2 = 0;
  
      while (third.indexOf(temp1) !== -1) {
        third.splice(third.indexOf(temp1), 1);
        count1++;
      }
  
      while (third.indexOf(temp2) !== -1) {
        third.splice(third.indexOf(temp2), 1);
        count2++;
      }
  
      if (third.length > 0) {
        const r = Math.floor(Math.random() * third.length);
        qns3.push(third[r]);
        third.splice(r, 1);
      } else {
        qns3.push("");
      }
  
      for (let j = 0; j < count1; j++) third.push(temp1);
      third.sort(() => Math.random() - 0.5);
  
      for (let j = 0; j < count2; j++) third.push(temp2);
      third.sort(() => Math.random() - 0.5);
    }
  
    const teams = {};
  
    for (let i = 0; i < qnsCount; i++) {
      teams[i] = [`${qns[i]}1`];
      qns[i] += '1';
  
      let temp = qns2[i];
      temp += (temp.charCodeAt(0) % 2 === 0) ? '2' : '3';
      qns2[i] = temp;
      teams[i].push(temp);
  
      temp = qns3[i];
      temp += (temp.charCodeAt(0) % 2 === 0) ? '3' : '2';
      qns3[i] = temp;
      teams[i].push(temp);
    }
  
    console.log(teams);
    admin.qn_distribution = teams;
    await admin.save();
    
    res.status(200).json({ message: 'POC distribution stored successfully', teams });
    
  } catch (error) {
    console.error('Error in POC distribution:', error);
    res.status(500).json({ error: 'POC distribution failed' });
  }
  }

  module.exports = {logic};
  