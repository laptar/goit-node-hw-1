const { table } = require("console");
const fs = require("fs/promises");
const path = require("path");
const uniqid = require("uniqid");
const contactPath = path.resolve("./db/contacts.json");

function listContacts() {
	fs.readFile(contactPath, "utf8").then((data) =>
		console.table(JSON.parse(data))
	);
}

function getContactById(contactId) {
	if (!contactId) {
		return console.log("\x1b[43m%s\x1b[0m", "Please enter id");
	}
	fs.readFile(contactPath, "utf8")
		.then((data) =>
			JSON.parse(data).filter((contact) => contact.id === String(contactId))
		)
		.then((contact) => {
			contact.length === 0
				? console.log(
						"\x1b[41m%s\x1b[0m",
						`Contact with id ${contactId} not found`
				  )
				: console.table(contact);
		});
}

function removeContact(contactId) {
	if (!contactId) {
		return console.log("\x1b[43m%s\x1b[0m", "Please enter id");
	}
	fs.readFile(contactPath, "utf8").then((data) => {
		const prevList = JSON.parse(data);
		const newList = prevList.filter(
			(contact) => contact.id !== String(contactId)
		);
		if (prevList.length !== newList.length) {
			const newListStr = JSON.stringify(newList);
			fs.writeFile(contactPath, newListStr, "utf8");
			console.table(newList);
			console.log(
				"\x1b[42m%s\x1b[0m",
				`The contact with ID ${contactId} has been deleted`
			);
		} else {
			console.log(
				"\x1b[41m%s\x1b[0m",
				`Contact with id ${contactId} not found`
			);
		}
	});
}

function addContact(name, email, phone) {
	if (!name || !email || !phone) {
		return console.log("\x1b[43m%s\x1b[0m", "Fill in all fields");
	}
	fs.readFile(contactPath, "utf8")
		.then((data) => {
			const newList = JSON.parse(data);
			newList.push({ id: uniqid(), name, email, phone });
			return newList;
		})
		.then((contacts) => {
			const newList = JSON.stringify(contacts);
			fs.writeFile(contactPath, newList, "utf8");
			console.table(contacts);
			console.log(
				"\x1b[42m%s\x1b[0m",
				"The contact is added to the bottom of the list"
			);
		});
}

module.exports = { listContacts, getContactById, removeContact, addContact };
