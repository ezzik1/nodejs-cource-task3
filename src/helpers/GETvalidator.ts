import * as http from 'node:http'
import database from '../DB/DB'

export default function GET(
    res: http.ServerResponse,
    id: string,
    users: database
): void {
    try {
        if (id && id !== '') {
            const ret = JSON.stringify(users.getPersons(id))
            res.writeHead(200)
            res.end(ret)
        } else {
            const ret = JSON.stringify(users.getPersons(''))
            res.writeHead(200)
            res.end(ret)
        }
    } catch (error) {
        res.writeHead(404)
        if (error instanceof Error) {
            res.end(error.message)
        } else {
            res.end('Something wrong with error handling')
        }
    }
}
