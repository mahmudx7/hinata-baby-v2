const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "4k",
                aliases: ["hd", "upscale"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "এআই এর মাধ্যমে ছবির কোয়ালিটি 4K বা এইচডি করুন",
                        en: "Enhance image quality to 4K using AI",
                        vi: "Nâng cao chất lượng hình ảnh lên 4K bằng AI"
                },
                category: "tools",
                guide: {
                        bn: '   {pn}: ছবির রিপ্লাই দিয়ে ব্যবহার করুন\n   {pn} <url>: ছবির লিঙ্ক দিয়ে ব্যবহার করুন',
                        en: '   {pn}: Reply to an image\n   {pn} <url>: Use with an image URL',
                        vi: '   {pn}: Phản hồi một hình ảnh\n   {pn} <url>: Sử dụng với liên kết hình ảnh'
                }
        },

        langs: {
                bn: {
                        noImg: "× বেবি, একটি ছবিতে রিপ্লাই দাও অথবা ছবির লিঙ্ক দাও! 😘",
                        wait: "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞...𝐰𝐚𝐢𝐭 𝐛𝐚𝐛𝐲 <😘",
                        success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noImg: "× Baby, please reply to an image or provide a URL! 😘",
                        wait: "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞...𝐰𝐚𝐢𝐭 𝐛𝐚𝐛𝐲 <😘",
                        success: "✅ | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝟒𝐤 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noImg: "× Cưng ơi, vui lòng phản hồi ảnh hoặc gửi link! 😘",
                        wait: "Đang tải ảnh 4K... chờ chút nhé cưng <😘",
                        success: "✅ | Đây là ảnh 4K của cưng nè",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                let imgUrl;
                if (event.messageReply?.attachments?.[0]?.type === "photo") {
                        imgUrl = event.messageReply.attachments[0].url;
                } else if (args[0]) {
                        imgUrl = args.join(" ");
                }

                if (!imgUrl) return message.reply(getLang("noImg"));

                const waitMsg = await message.reply(getLang("wait"));
                message.reaction("😘", event.messageID);

                try {
                        const baseUrl = await mahmud();
                        const apiUrl = `${baseUrl}/api/hd?imgUrl=${encodeURIComponent(imgUrl)}`;

                        const res = await axios.get(apiUrl, { responseType: "stream" });

                        if (waitMsg?.messageID) message.unsend(waitMsg.messageID);
                        message.reaction("✅", event.messageID);

                        return message.reply({
                                body: getLang("success"),
                                attachment: res.data
                        });

                } catch (err) {
                        console.error("4K Error:", err);
                        if (waitMsg?.messageID) message.unsend(waitMsg.messageID);
                        message.reaction("❎", event.messageID);
                        return message.reply(getLang("error", err.message));
                }
        }
};
