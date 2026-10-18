import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'

const server = createServer(async (req, res) => {
    res.setHeader(
        'Content-Type',
        'text/plain; charset=utf-8'
    )

    console.log(
        req.method,
        req.url
    )

    if (req.url === '/hello' && req.method === 'GET') {
        try {
            const text = await readFile('./data/hello', 'utf-8')
            console.log(text)
            res.end(text)
        } catch (err) {
            res.statusCode = 404
            res.end('File not found')
        }
    } else {
        res.statusCode = 404
        res.end('Not found')
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000')
})