import * as http from 'node:http'
import database from '../DB/DB'
import type { Person } from '../DB/DB.types'

export default function PUT(
    res: http.ServerResponse,
    data: Person,
    users: database
): void {
    try {
        if (data.hobbies) {
            if (!Array.isArray(data.hobbies)) {
                throw new Error(
                    'username must be string, age must be number, hobbies must be array of string'
                )
            }
        }
        if (data.username) {
            if (typeof data.username !== 'string') {
                throw new Error(
                    'username must be string, age must be number, hobbies must be array of string'
                )
            }
        }
        if (data.age) {
            if (typeof data.age !== 'number') {
                throw new Error(
                    'username must be string, age must be number, hobbies must be array of string'
                )
            }
        }

        const ret = users.putPerson(
            data.id,
            data.username,
            data.age,
            data.hobbies
        )
        res.writeHead(200)
        res.end(JSON.stringify(ret))
    } catch (error) {
        res.writeHead(404)
        if (error instanceof Error) {
            res.end(error.message)
        } else {
            res.end('Something wrong with error handling')
        }
    }
}
