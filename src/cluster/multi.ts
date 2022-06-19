import * as http from 'node:http'
import cluster from 'node:cluster'
import * as os from 'node:os'
import database from '../DB/DB'
import mainEvent from '../mainEvent/mainEvent'
import * as process from 'node:process'

function multi(server: http.Server, Users: database) {
    if (!cluster.isWorker) {
        const cpus = os.cpus().length
        for (let i = 0; i < cpus; i++) {
            cluster.fork()
        }
    } else {
        const PORT = Number(process.env.PORT ? process.env.PORT : 5000)
        server.listen(PORT, () =>
            console.log(
                `Server is running on http://localhost:${PORT}; Worker pid: ${process.pid}`
            )
        )
        multiCluster(server, Users)
    }
}

function multiCluster(server: http.Server, Users: database) {
    server.on(
        'request',
        async (req: http.IncomingMessage, res: http.ServerResponse) => {
            console.log(`Worker with pid: ${process.pid} handling request`)
            //nthFibonacci(1000) //<-- раблокировать для тестирования распределения нагрузки по воркерам
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
                    await mainEvent(res, req, reqURL, Users)
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

export default multi

//в данном случае было необходимо, для возможности тестирования кластера на нагрузку
/* tslint:disable-next-line */
const nthFibonacci: any = (n: number) => {
    return n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2)
}
