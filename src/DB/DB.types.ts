interface DB {
    persons: Persons | []

    addPerson(username: string, age: number, hobbies: string[]): Person
    getPersons(id: string): Persons | Person
    putPerson(
        id: string,
        username?: string,
        age?: number,
        hobbies?: string[]
    ): void
    deletePerson(id: string): void
    checkPerson(id: string): boolean
}

type Person = {
    id: string
    username: string
    age: number
    hobbies: string[]
}

type Persons = Array<Person>

export type { Person, Persons, DB }
