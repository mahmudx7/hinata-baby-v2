const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
        config: {
                name: "admin",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 2,
                description: {
                        bn: "বোট অ্যাডমিন যোগ, অপসারণ বা তালিকা দেখুন",
                        en: "Add, remove, or list bot admins",
                        vi: "Thêm, xóa, sửa quyền admin"
                },
                category: "box chat",
                guide: {
                        bn: '   {pn} add [ID | @tag]: অ্যাডমিন যোগ করতে\n   {pn} remove [ID | @tag]: অ্যাডমিন সরাতে\n   {pn} list: অ্যাডমিন লিস্ট দেখতে',
                        en: '   {pn} [add | -a] <uid | @tag>: Add admin role\n   {pn} [remove | -r] <uid | @tag>: Remove admin role\n   {pn} [list | -l]: List all admins',
                        vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền admin\n   {pn} [remove | -r] <uid | @tag>: Xóa quyền admin\n   {pn} [list | -l]: Liệt kê danh sách admin'
                }
        },

        langs: {
                bn: {
                        added: "✅ | সফলভাবে %1 জনকে অ্যাডমিন করা হয়েছে:\n%2",
                        alreadyAdmin: "\n⚠️ | %1 জন আগে থেকেই অ্যাডমিন ছিল:\n%2",
                        missingIdAdd: "⚠️ | বেবি, অ্যাডমিন করতে আইডি দিন অথবা কাউকে ট্যাগ করুন!",
                        removed: "✅ | সফলভাবে %1 জনের অ্যাডমিন পারমিশন সরানো হয়েছে:\n%2",
                        notAdmin: "⚠️ | %1 জন অ্যাডমিন তালিকায় ছিল না:\n%2",
                        missingIdRemove: "⚠️ | বেবি, অ্যাডমিন সরাতে আইডি দিন অথবা কাউকে ট্যাগ করুন!",
                        listAdmin: "👑 | বোট অ্যাডমিন তালিকা:\n\n%1"
                },
                en: {
                        added: "✅ | Added admin role for %1 users:\n%2",
                        alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
                        missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
                        removed: "✅ | Removed admin role of %1 users:\n%2",
                        notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
                        missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
                        listAdmin: "👑 | List of admins:\n\n%1"
                },
                vi: {
                        added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
                        alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin:\n%2",
                        missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag để thêm admin",
                        removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
                        notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
                        missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag để xóa admin",
                        listAdmin: "👑 | Danh sách admin:\n\n%1"
                }
        },

        onStart: async function ({ api, message, args, usersData, event, getLang }) {
                const action = args[0]?.toLowerCase();
                const { threadID, messageID } = event;

                switch (action) {
                        case "add":
                        case "-a": {
                                if (args[1] || event.messageReply) {
                                        let uids = [];
                                        if (Object.keys(event.mentions).length > 0)
                                                uids = Object.keys(event.mentions);
                                        else if (event.messageReply)
                                                uids.push(event.messageReply.senderID);
                                        else
                                                uids = args.filter(arg => !isNaN(arg));

                                        const notAdminIds = [];
                                        const adminIds = [];
                                        for (const uid of uids) {
                                                if (config.adminBot.includes(uid))
                                                        adminIds.push(uid);
                                                else
                                                        notAdminIds.push(uid);
                                        }

                                        config.adminBot.push(...notAdminIds);
                                        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                                        const response = (notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.filter(u => notAdminIds.includes(u.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                                                + (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, getNames.filter(u => adminIds.includes(u.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "");

                                        return api.sendMessage(response, threadID, messageID);
                                } else {
                                        return api.sendMessage(getLang("missingIdAdd"), threadID, messageID);
                                }
                        }

                        case "remove":
                        case "-r": {
                                if (args[1] || event.messageReply) {
                                        let uids = [];
                                        if (Object.keys(event.mentions).length > 0)
                                                uids = Object.keys(event.mentions);
                                        else if (event.messageReply)
                                                uids.push(event.messageReply.senderID);
                                        else
                                                uids = args.filter(arg => !isNaN(arg));

                                        const notAdminIds = [];
                                        const adminIds = [];
                                        for (const uid of uids) {
                                                if (config.adminBot.includes(uid))
                                                        adminIds.push(uid);
                                                else
                                                        notAdminIds.push(uid);
                                        }

                                        for (const uid of adminIds)
                                                config.adminBot.splice(config.adminBot.indexOf(uid), 1);

                                        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                                        const response = (adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.filter(u => adminIds.includes(u.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                                                + (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, getNames.filter(u => notAdminIds.includes(u.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "");

                                        return api.sendMessage(response, threadID, messageID);
                                } else {
                                        return api.sendMessage(getLang("missingIdRemove"), threadID, messageID);
                                }
                        }

                        case "list":
                        case "-l": {
                                const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                const listMsg = getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name}\n  └ ID: ${uid}`).join("\n\n"));
                                return api.sendMessage(listMsg, threadID, messageID);
                        }

                        default:
                                return message.SyntaxError();
                }
        }
};
