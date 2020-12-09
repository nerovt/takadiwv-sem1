
/** @module Items */

import sqlite from 'sqlite-async'

/**
 * Items
 * ES6 module that handles data relating to items being sold
 */
class Items {
	/**
   * Create an items object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the items
			const sql = 'CREATE TABLE IF NOT EXISTS items\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, image TEXT, status TEXT,\
seller TEXT, phoneNumber TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers an item to be sold
	 * @param {String} item the items name
	 * @param {String} image the link to image
	 * @param {String} status the status of the item selling
	 * @param {String} seller the username of the person selling the item
	 * @param {String} phoneNumber the phone number of the person selling
	 * @returns {Boolean} returns true if the new entry has been added
	 */
	async register(item, image, status, seller, phoneNumber) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `INSERT INTO items(item, image, status, seller, phoneNumber)\
VALUES("${item}", "${image}", "${status}", "${seller}", "${phoneNumber}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * retrieve values from database
	 * @returns {Array} returns an array of objects (where the objects hold each row's data)
	 */
	async getDetails() {
		const sql = 'SELECT * FROM items;'
		const record = await this.db.all(sql)
		return record
	}
    
	/**
	 * deletes record from database
	 * @param {Number} id of record in database
	 */
    async deleteItem(id) {
		let sql = `SELECT COUNT(id) as records FROM items WHERE id="${id}";`
		const data = await this.db.get(sql)
		if(data.records === 0) throw new Error(`item record with "${id}" not found`)
        sql = `DELETE FROM items WHERE id=${id}`
        await this.db.run(sql)
    }

	async close() {
		await this.db.close()
	}
}

export default Items
