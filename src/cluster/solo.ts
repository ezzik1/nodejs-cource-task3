import * as http from 'node:http'
import database from '../DB/DB'
import mainEvent from '../mainEvent/mainEvent'

function soloStart(server: http.Server, Users: database) {
    const PORT = Number(process.env.PORT ? process.env.PORT : 5000)

    server.listen(PORT, () =>
        console.log(`Server is running on http://localhost:${PORT}`)
    )
    server.on(
        'request',
        async (req: http.IncomingMessage, res: http.ServerResponse) => {
            const reqURL: string[] | undefined = req.url
                ? req.url.split('/').slice(1)
                : []
            if (
                reqURL[1] !== 'users' ||
                reqURL.length > 3 ||
                reqURL[0] !== 'api' ||
                reqURL.length < 2
            ) {
                res.writeHead(404)
                res.end('Not supported path')
            } else {
                try {
                    mainEvent(res, req, reqURL, Users)
                } catch (error) {
                    console.log(error)
                    res.writeHead(500)
                    res.end('App was broken')
                }
            }

            if (!res.getHeaders()) {
                res.writeHead(404)
                res.end('Body is empty')
            }
        }
    )
}

export default soloStart
