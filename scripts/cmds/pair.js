const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "pair",
    version: "1.7",
    author: "MahMUD",
    category: "Friendship",
    guide: "{pn}",
  },

  onStart: async function ({ api, event, args }) {
      const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68); 
      if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
     }
    
    try {
      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo;
      const myData = users.find((u) => u.id === event.senderID);

      if (!myData || !myData.gender)
      return api.sendMessage("Undefined gender.", event.threadID, event.messageID);
      const myGender = myData.gender.toUpperCase();
      let matchCandidates = [];

      if (myGender === "MALE")
      matchCandidates = users.filter((u) => u.gender === "FEMALE" && u.id !== event.senderID); else if (myGender === "FEMALE")
      matchCandidates = users.filter((u) => u.gender === "MALE" && u.id !== event.senderID);else 
      matchCandidates = users.filter((u) => u.id !== event.senderID);
      
      if (matchCandidates.length === 0)
      return api.sendMessage("No match found.", event.threadID, event.messageID);

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      const apiUrl = await baseApiUrl();
      const { data } = await axios.get(`${apiUrl}/api/pair/mahmud?user1=${event.senderID}&user2=${selectedMatch.id}&style=1`,
        { responseType: "arraybuffer" }
      );

      const outputPath = path.join(__dirname, `pair_${event.senderID}.png`);
      fs.writeFileSync(outputPath, Buffer.from(data));

      const name1 = myData.name || "You";
      const name2 = selectedMatch.name || "Partner";

      await api.sendMessage(
        {
          body: `Successful pairing\n• ${name1}\n• ${name2}\n\nLove percentage: ${Math.floor(Math.random() * 100) + 1}%`,
          attachment: fs.createReadStream(outputPath),
        },
        event.threadID,
        () => fs.unlinkSync(outputPath),
        event.messageID
      );

    } catch (err) {
      api.sendMessage("🥹error, contact MahMUD.", event.threadID, event.messageID);
    }
  },
};
