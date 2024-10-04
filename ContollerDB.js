const configPG = require('./config')
const pg = require('pg')

const GenMockData = require('./getMockData')

const { Client } = pg
const client = new Client(configPG)

class ControllerDB {
	constructor() {}

	async connect(){
		await client.connect()
	}
	async disconnect(){
		await client.end()
	}

	

	async #_createTable(nameTable) {
		await client.query(
			`DROP TABLE IF EXISTS ${nameTable};
			CREATE TABLE ${nameTable} (id INTEGER PRIMARY KEY,name VARCHAR(255),description VARCHAR(255));`
		)
	}
	async #_includeData(nameTable, amountMockElement = 100) {
		const getMockData = new GenMockData(amountMockElement)
		const mockData = getMockData.genMockData()
		const dbMckData = mockData.map(
			(el) =>
				`INSERT INTO ${nameTable} (id, name,description) VALUES (${el.id}, '${el.name}' ,'${el.description}');`
		)
		await client.query(dbMckData.join(' '))
	}
	async #_createManyTables(namesTable = []) {
		const query = namesTable.reduce(
			(acum, el) =>
				acum +
				`DROP TABLE IF EXISTS ${el};
				CREATE TABLE ${el} (id INTEGER PRIMARY KEY,name VARCHAR(255),description VARCHAR(255));`,
			``
		)

		await client.query(query)
	}

	async #_addData(namesTable = [], amountMockElement = 100) {
		

		const getMockData = new GenMockData(amountMockElement)
		const mockData = getMockData.genMockData()

		const query = []
		namesTable.forEach((nameTable) => {
			const str = mockData.reduce((acum, el) => {
				return (
					acum +
					`INSERT INTO ${nameTable} (id, name,description) VALUES (${el.id}, '${el.name}' ,'${el.description}');`
				)
			}, '')
			query.push(str)
		})

		await client.query(query.join(' '))
	}

	async createTablesWithMockDataPromiseAll(namesTable, amountMockElement) {
		try {
			
			const newTables = namesTable.map((nameTable) =>
				this.#_createTable(nameTable)
			)
			const insertData = namesTable.map((nameTable) =>
				this.#_includeData(nameTable, amountMockElement)
			)
			await Promise.all(newTables)
			await Promise.all(insertData)
		} catch (error) {
			console.log(error)
		}
	}

	async createTablesWithMockData(namesTable, amountMockElement) {
		try {
			// await client.connect()
			await this.#_createManyTables(namesTable)
			await this.#_addData(namesTable,amountMockElement)
		} catch (error) {
			console.log(error)
		}
	}

	async search(nameTable, dataQuery) {
		try {
			//await client.connect()
			const [data, count] = await client.query(
				`SELECT id, name, description	FROM ${nameTable}	 WHERE (name  LIKE '%${dataQuery}%' OR description LIKE '%${dataQuery}%' ) ORDER BY name ASC LIMIT 20 ;
				SELECT COUNT(*) OVER() AS total_count FROM ${nameTable} WHERE (name  LIKE '%${dataQuery}%' OR description LIKE '%${dataQuery}% ' ) LIMIT 1`
			)
			//client.end()

			if (count.rows.length === 0) return null
			return {
				data: data.rows,
				count: count.rows[0].total_count,
			}
		} catch (error) {
			console.log(error)
			return null
		}
	}
}

module.exports = ControllerDB
