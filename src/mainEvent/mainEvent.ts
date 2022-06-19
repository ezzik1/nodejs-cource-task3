import { GET, DELETE, POST, PUT } from '../helpers/index'
import { validate } from 'uuid'
import * as http from 'node:http'
import database from '../DB/DB'

export default async function mainEvent(
    res: http.ServerResponse,
    req: http.IncomingMessage,
    reqURL: string[],
    users: database
) {
    const objectParams = ['age', 'hobbies', 'username', 'id']
    let id = ''
    switch (req.method) {
        case 'POST':
            req.on('data', (output: string) => {
                const data = JSON.parse(output.toString())
                try {
                    const keys = Object.keys(data)
                    const methods = keys.filter(
                        (i) => !objectParams.includes(i)
                    )
                    if (methods.length > 0) {
                        throw new Error(
                            'An object can only have age, name and hobbies keys'
                        )
                    }
                    if (reqURL[2]) {
                        throw new Error('Сant add custom id to POST request')
                    }

                    POST(res, data, users)
                } catch (error) {
                    res.writeHead(400)
                    if (error instanceof Error) {
                        res.end(error.message)
                    } else {
                        res.end('Something wrong with error handling')
                    }
                }
            })
            req.on('close', () => {
                if (!res.headersSent) {
                    res.writeHead(400)
                    res.end('The body cannot be empty')
                }
            })
            break
        case 'GET':
            try {
                if (reqURL[2]) {
                    if (!validate(reqURL[2])) {
                        res.writeHead(400)
                        res.end('ID is not valid (not uuid)')
                        break
                    } else {
                        id = reqURL[2]
                    }
                }
                GET(res, id, users)
            } catch (error) {
                res.writeHead(400)
                if (error instanceof Error) {
                    res.end(error.message)
                } else {
                    res.end('Something wrong with error handling')
                }
            }
            break
        case 'PUT':
            req.on('data', (output) => {
                try {
                    console.log(reqURL[2], validate(reqURL[2]))
                    if (reqURL[2]) {
                        if (!validate(reqURL[2])) {
                            throw new Error('ID is not valid (not uuid)')
                        }
                    } else {
                        throw new Error('ID required to change person values')
                    }
                    const data = JSON.parse(output.toString('utf8'))
                    const keys = Object.keys(data)
                    const methods = keys.filter(
                        (i) => !objectParams.includes(i)
                    )
                    if (methods.length > 0) {
                        throw new Error(
                            'An object can only have age, name and hobbies keys'
                        )
                    }

                    data.id = reqURL[2]
                    PUT(res, data, users)
                } catch (error) {
                    res.writeHead(400)
                    if (error instanceof Error) {
                        res.end(error.message)
                    } else {
                        res.end('Something wrong with error handling')
                    }
                }
            })
            req.on('close', () => {
                if (!res.headersSent) {
                    res.writeHead(400)
                    res.end('The body cannot be empty')
                }
            })
            break
        case 'DELETE':
            try {
                if (reqURL[2]) {
                    if (!validate(reqURL[2])) {
                        res.writeHead(400)
                        res.end('ID is not valid (not uuid)')
                    } else {
                        DELETE(res, reqURL[2], users)
                    }
                } else {
                    throw new Error('ID required to change person values')
                }
            } catch (error) {
                res.writeHead(400)
                if (error instanceof Error) {
                    res.end(error.message)
                } else {
                    res.end('Something wrong with error handling')
                }
            }
            break
        default:
            res.writeHead(400)
            res.end('Unsupported method')
            break
    }
}
