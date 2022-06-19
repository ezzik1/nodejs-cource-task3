import * as http from 'node:http'
import database from '../DB/DB'
import type { Person } from '../DB/DB.types'

export default function POST(
    res: http.ServerResponse,
    data: Person,
    users: database
): void {
    if (data.id) {
        throw new Error('ID cannot be created by user')
    }

    if (
        !data.username ||
        !data.age ||
        !data.hobbies ||
        data.hobbies.length < 0
    ) {
        throw new Error('username, age, hobbies is require')
    }

    if (
        !Array.isArray(data.hobbies) ||
        typeof data.username !== 'string' ||
        typeof data.age !== 'number'
    ) {
        throw new Error(
            'username must be string, age must be number, hobbies must be array of string'
        )
    }

    try {
        const ret = users.addPerson(data.username, data.age, data.hobbies)
        res.writeHead(201)
        res.end(JSON.stringify(ret))
    } catch (error) {
        res.writeHead(500)
        res.end('Something wrong on server')
    }
}
