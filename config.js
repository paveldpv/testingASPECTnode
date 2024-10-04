const configPG = {
	user    : process.env.user|| 'postgres',      //?.dotenv
	password: process.env.password|| 'qwerty',    //?.dotenv
	host    : process.env.host|| '127.0.0.1',     //?.dotenv
	port    : process.env.port||7800,             //?.dotenv
	database: process.env.database||'postgres',   //?.dotenv
}
module.exports = configPG