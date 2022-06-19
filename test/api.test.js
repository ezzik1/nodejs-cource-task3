const pactum = require('pactum')

describe('Test API #1 scenario: user expirience', () => {
    let json = {
        username: 'Ilya',
        age: 25,
        hobbies: ['test1', 'test2'],
    }
    test('GET. Check users. Status 200. Expected []', async () => {
        await pactum
            .spec()
            .get('http://localhost:3000/api/users')
            .expectStatus(200)
            .expectBody('[]')
    })

    test('POST. Create new user. Status 201. Expected new User', async () => {
        json.id = await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .withBody(JSON.stringify(json))
            .expectStatus(201)
            .expectJsonMatch('username', json.username)
            .expectJsonMatch('age', json.age)
            .expectJsonMatch('hobbies', json.hobbies)
            .returns('id')
    })

    test('GET. Check user with ID. Status 200. Expected User Info', async () => {
        await pactum
            .spec()
            .get(`http://localhost:3000/api/users/${json.id}`)
            .expectStatus(200)
            .expectJsonMatch('username', json.username)
            .expectJsonMatch('age', json.age)
            .expectJsonMatch('hobbies', json.hobbies)
    })

    test('PUT. Update User Info. Status 200. Expected new User', async () => {
        const newJson = {
            age: 35,
            username: 'Test',
        }
        json.age = newJson.age
        json.username = newJson.username
        await pactum
            .spec()
            .put(`http://localhost:3000/api/users/${json.id}`)
            .withBody(JSON.stringify(newJson))
            .expectStatus(200)
            .expectJsonMatch('username', json.username)
            .expectJsonMatch('age', json.age)
    })

    test('DELETE. Delete user. Status 200. Expected "User deleted"', async () => {
        await pactum
            .spec()
            .delete(`http://localhost:3000/api/users/${json.id}`)
            .expectStatus(200)
            .expectBody('User deleted')
    })

    test('GET. Deleted user. Status 404. Expected "User with this id is not included"', async () => {
        await pactum
            .spec()
            .get(`http://localhost:3000/api/users/${json.id}`)
            .expectStatus(404)
            .expectBody('User with this id is not included')
    })
})

describe('Test API #2 scenatio: GET, POST', () => {
    let json = {
        username: 'Ilya',
        age: 25,
    }

    test('GET. User with random ID. Status 400. Expected "ID is not valid (not uuid)"', async () => {
        await pactum
            .spec()
            .get('http://localhost:3000/api/users/test')
            .expectStatus(400)
            .expectBody('ID is not valid (not uuid)')
    })

    test('POST. New user without hobbies. Status 400. Expected "username, age, hobbies is require"', async () => {
        await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .withBody(JSON.stringify(json))
            .expectStatus(400)
            .expectBody('username, age, hobbies is require')
    })

    test('POST. New user with id. Status 400. Expected "ID cannot be created by user"', async () => {
        json.hobbies = ['test1', 'test2']
        const newJson = json
        newJson.id = 'test'
        await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .withBody(JSON.stringify(newJson))
            .expectStatus(400)
            .expectBody('ID cannot be created by user')
    })

    test('POST. New user with the wrong types. Status 400. Expected "username must be string, age must be number, hobbies must be array of string"', async () => {
        const tempJson = {
            username: 'Ilya',
            age: 25,
            hobbies: 'test',
        }

        await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .withBody(JSON.stringify(tempJson))
            .expectStatus(400)
            .expectBody(
                'username must be string, age must be number, hobbies must be array of string'
            )
    })

    test('POST. Empty body. Status 400. Expected "The body cannot be empty"', async () => {
        await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .expectStatus(400)
            .expectBody('The body cannot be empty')
    })
})

describe('Test API #3 scenario: errors DELETE, PUT', () => {
    let json = {
        username: 'Ilya',
        age: 25,
        hobbies: ['test1', 'test2'],
    }

    test('POST. Create new user. Status 201. Expected new User', async () => {
        json.id = await pactum
            .spec()
            .post('http://localhost:3000/api/users')
            .withBody(JSON.stringify(json))
            .expectStatus(201)
            .expectJsonMatch('username', json.username)
            .expectJsonMatch('age', json.age)
            .expectJsonMatch('hobbies', json.hobbies)
            .returns('id')
    })

    test('PUT. Update User Info with the wrong types. Status 404. Expected "username must be string, age must be number, hobbies must be array of string"', async () => {
        const testPutJson = {
            username: 24,
            age: 'qwe',
        }
        await pactum
            .spec()
            .put(`http://localhost:3000/api/users/${json.id}`)
            .withBody(JSON.stringify(testPutJson))
            .expectStatus(404)
            .expectBody(
                'username must be string, age must be number, hobbies must be array of string'
            )
    })

    test('PUT. Update User Info with the wrong keys. Status 400. Expected "An object can only have age, name and hobbies keys"', async () => {
        const testPutJson = {
            test: 'qwe',
        }
        await pactum
            .spec()
            .put(`http://localhost:3000/api/users/${json.id}`)
            .withBody(JSON.stringify(testPutJson))
            .expectStatus(400)
            .expectBody('An object can only have age, name and hobbies keys')
    })

    test('PUT. Empty body. Status 400. Expected "The body cannot be empty"', async () => {
        await pactum
            .spec()
            .put(`http://localhost:3000/api/users/${json.id}`)
            .expectStatus(400)
            .expectBody('The body cannot be empty')
    })

    test('PUT. Update User Info with random ID. Status 400. Expected "ID is not valid (not uuid)"', async () => {
        await pactum
            .spec()
            .put(`http://localhost:3000/api/users/test`)
            .withBody(JSON.stringify(json))
            .expectStatus(400)
            .expectBody('ID is not valid (not uuid)')
    })
})
