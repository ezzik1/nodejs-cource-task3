import * as http from 'node:http'
import database from '../DB/DB'

export default function DELETE(
    res: http.ServerResponse,
    id: string,
    users: database
): void {
    try {
        if (!users.checkPerson(id)) {
            throw new Error('Person with this id was not found')
        } else {
            users.deletePerson(id)
            res.writeHead(200)
            res.end('User deleted')
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
