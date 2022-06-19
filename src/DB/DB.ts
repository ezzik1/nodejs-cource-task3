import { v4 } from 'uuid'
import type { Person, Persons, DB } from './DB.types'

export default class database implements DB {
    persons: Persons
    constructor() {
        this.persons = []
    }

    addPerson(name: string, age: number, hobbies: string[]) {
        const user: Person = {
            id: v4(),
            username: name,
            age: age,
            hobbies: hobbies,
        }

        this.persons.push(user)
        return user
    }

    getPersons(id: string) {
        if (id !== '') {
            const temp = this.persons.findIndex((e) => e.id === id)
            if (temp >= 0) {
                const ret = this.persons[temp]
                return ret
            } else {
                throw new Error('User with this id is not included')
            }
        } else {
            return this.persons
        }
    }

    putPerson(id: string, name?: string, age?: number, hobbies?: string[]) {
        const obj = this.persons.find((e) => e.id === id)
        if (obj) {
            if (name) {
                obj.username = name
            }

            if (age) {
                obj.age = age
            }

            if (hobbies) {
                obj.hobbies = hobbies
            }

            this.persons = this.persons.map((e) => {
                return e.id === obj.id ? obj : e
            })
            return this.getPersons(id)
        } else {
            throw new Error('User with this id is not included')
        }
    }

    deletePerson(id: string) {
        const temp = this.persons.filter((e) => e.id !== id)
        this.persons = temp
        return
    }

    checkPerson(id: string) {
        return this.persons.filter((e) => e.id === id).length > 0
    }
}
