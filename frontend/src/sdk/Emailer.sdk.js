import { Remote } from "./remote.js"

export class Emailer {
    static remote = new Remote("https://3cpxcugakzk2vgtl6roai4mwga0eyavw.lambda-url.us-east-1.on.aws/")

    static async init() {
        return Emailer.remote.call("Emailer.init")  
    }
    
    static async getSubscribers() {
        return Emailer.remote.call("Emailer.getSubscribers")  
    }
    
    static async process(data, ) {
        return Emailer.remote.call("Emailer.process", data, )  
    }

    static async save(data) {
        return Emailer.remote.call("Emailer.save", data)  
    }

    static async getAll() {
        return Emailer.remote.call("Emailer.getAll")  
    }
    
    static async getOne(mailId) {
        return Emailer.remote.call("Emailer.getOne", mailId)  
    }

    static async update(mailId, data) {
        return Emailer.remote.call("Emailer.update", mailId, data)  
    }

    static async send(mailId) {
        return Emailer.remote.call("Emailer.send", mailId)  
    }

    static async getCount() {
        return Emailer.remote.call("Emailer.getCount")  
    }
    
    static async generateId() {
        return Emailer.remote.call("Emailer.generateId")  
    }
    
    static async getTemplate() {
        return Emailer.remote.call("Emailer.getTemplate")  
    }
    
    static async parseHtml(replacements, source) {
        return Emailer.remote.call("Emailer.parseHtml", replacements, source)  
    }

    
}

export { Remote };
