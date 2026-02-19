const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "rip",
                aliases: ["কবর"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "কাউকে কবর দেওয়ার এডিট ছবি তৈরি করুন",
                        en: "Create a RIP tombstone edit image of someone",
                        vi: "Tạo ảnh chỉnh sửa bia mộ RIP cho ai đó"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} <মেনশন/রিপ্লাই/UID>: কমান্ডটি ব্যবহার করে ছবি তৈরি করুন',
                        en: '   {pn} <mention/reply/UID>: Use to create tombstone image',
                        vi: '   {pn} <đề cập/trả lời/UID>: Sử dụng để tạo hình ảnh bia mộ'
                }
        },

        langs: {
                bn: {
                        noTarget: "× বেবি, কাকে কবর দেবে? মেনশন, রিপ্লাই বা UID দাও! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐑𝐈𝐏 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noTarget: "× Baby, mention, reply, or provide UID of the target! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐑𝐈𝐏 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noTarget: "× Cưng ơi, hãy đề cập, phản hồi hoặc cung cấp UID! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐑𝐈𝐏 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 <😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const { threadID, messageID, messageReply, mentions } = event;
                let id2;
                if (messageReply) id2 = messageReply.senderID;
                else if (Object.keys(mentions).length > 0) id2 = Object.keys(mentions)[0];
                else if (args[0]) id2 = args[0];
                else return message.reply(getLang("noTarget"));

                const cacheDir = path.join(__dirname, "cache");
                const filePath = path.join(cacheDir, `rip_${id2}_${Date.now()}.png`);
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

                try {
                        
                        api.setMessageReaction("⏳", messageID, () => {}, true);

                        const baseUrl = await baseApiUrl();
                        const url = `${baseUrl}/api/dig?type=rip&user=${id2}`;
                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        
                        fs.writeFileSync(filePath, response.data);

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                api.setMessageReaction("🪽", messageID, () => {}, true);
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("RIP Error:", err);
                        api.setMessageReaction("❌", messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        const errorMsg = err.response?.data?.error || err.message;
                        return message.reply(getLang("error", errorMsg));
                }
        }
};
