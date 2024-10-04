const ControllerDB = require('./ContollerDB')
const controllerDB = new ControllerDB()




const nameTable =["table1",'table2','table3']


test('search found one result', async () => {
	await controllerDB.connect()
	//await controllerDB.createTablesWithMockDataPromiseAll(nameTable,10000)
	//or
	await controllerDB.createTablesWithMockData(nameTable,10000)

	expect(await controllerDB.search('table1', '9999')).toEqual({
		data: [{ id: "9999", name: 'name 9999', description: 'description 9999' }],
		count: '1',
	})	
})

test('if the number of records is greater than the data length', async () => {	
	const data = await controllerDB.search('table1', '10')
	expect(data.count>data.data.length).toBe(true)
})

test('correspondence RegEx query', async () => {	
	const query = '9999'
	const data = await controllerDB.search('table1', query)
	expect(RegExp(query).test(data.data[0].name) || RegExp(query).test(data.data[0].description)).toBe(true)
})

test('non existent table', async () => {
	expect(await controllerDB.search('NOT_EXISTENT_TABLE', '999924324')).toBeNull()	
})


test('if the number of records is equal than the data length', async () => {	
	const data = await controllerDB.search('table1', '200')
	expect(data.count==data.data.length).toBe(true)
})

test('search not found (null) other table  (table2)', async () => {
	expect(await controllerDB.search('table2', '999924324')).toBeNull()
	
})


test('search not found (null)', async () => {
	expect(await controllerDB.search('table1', '999924324')).toBeNull()
	await controllerDB.disconnect()
})



