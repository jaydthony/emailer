import { Remote } from "./remote.js"

export class Emailer {
    static remote = new Remote("http://127.0.0.1:8083/Emailer")

    static async getSubscribers() {
        return Emailer.remote.call("Emailer.getSubscribers")  
    }
    
    static async save(data) {
        return Emailer.remote.call("Emailer.save", data)  
    }

    static async getAll() {
        return Emailer.remote.call("Emailer.getAll")  
    }
    
    static async getOne(id) {
        return Emailer.remote.call("Emailer.getOne", id)  
    }

    static async send(data) {
        return Emailer.remote.call("Emailer.send", data)  
    }

    static async getCount() {
        return Emailer.remote.call("Emailer.getCount")  
    }
    
    static async generateId() {
        return Emailer.remote.call("Emailer.generateId")  
    }
    
    static async parseHtml(replacements, ) {
        return Emailer.remote.call("Emailer.parseHtml", replacements, )  
    }

    
}

export { Remote };
