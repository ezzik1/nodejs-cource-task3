import 'dotenv/config'
import * as http from 'node:http'
import database from './DB/DB'
import multi from './cluster/multi'
import soloStart from './cluster/solo'

const Users = new database()
const server = http.createServer()
const argv = process.argv.slice(2)

if (argv[0] === '--cluster=multi') {
    multi(server, Users)
} else {
    soloStart(server, Users)
}
