import { delay, ranNumb } from '../../lib/func.js'
import db from '../../lib/database.js'

let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
	let groups
	try { groups = Object.keys(await conn.groupFetchAllParticipating()) }
	catch { return }
	let img, thumb, q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (mime) img = await q.download?.()
	conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groups.length} chat_`, m)
	let teks = `_*「 BroadCast-Bot 」*_${text ? ('\n\n'+text) : ''}`
	if (/audio/.test(mime)) thumb = await (await fetch('https://raw.githubusercontent.com/clicknetcafe/Databasee/main/azamibot/menus.json')).json().then(v => v.getRandom())
	for (let x of groups) {
		try {
			if (/image|video/g.test(mime) && !/webp/.test(mime)) await conn.sendMsg(x, { [/image/.test(mime) ? 'image' : 'video']: img, caption: teks }, { quoted: fkontak })
			else if (/audio/.test(mime)) await conn.sendFAudio(x, { audio: img, mimetype: 'audio/mpeg', ptt: true }, fkontak, text || pauthor, thumb, db.data.datas.linkgc)
			else await conn.reply(x, teks, fkontak)
			await delay(ranNumb(2000, 5500))
		} catch (e) {
			console.log(e)
		}
	}
	await m.reply('Selesai Broadcast All Group Chat :)')
}

handler.menuowner = ['bcgroup']
handler.tagsowner = ['owner']
handler.command = /^((bc|broadcast)(gc|gro?ups?))$/i

handler.owner = true

export default handler