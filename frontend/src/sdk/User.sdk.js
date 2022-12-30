import { Remote } from "./remote.js"

export class User {
    static remote = new Remote("http://127.0.0.1:8083/User")

    static async create(data) {
        return User.remote.call("User.create", data)  
    }

    static async login(data) {
        return User.remote.call("User.login", data)  
    }

    static async checkPasswordValidity(password) {
        return User.remote.call("User.checkPasswordValidity", password)  
    }

    static async generateId() {
        return User.remote.call("User.generateId")  
    }
    
    static async testUsername(text) {
        return User.remote.call("User.testUsername", text)  
    }

    static async testEmail(email) {
        return User.remote.call("User.testEmail", email)  
    }

    static async testPassword(password) {
        return User.remote.call("User.testPassword", password)  
    }

    static async response(data, ) {
        return User.remote.call("User.response", data, )  
    }

    static async createToken(data) {
        return User.remote.call("User.createToken", data)  
    }

    static async verify(key) {
        return User.remote.call("User.verify", key)  
    }

    
}

export { Remote };
