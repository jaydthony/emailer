import { Remote } from "./remote.js"

export class Cron {
    static remote = new Remote("http://127.0.0.1:8083/Cron")

    static async schedule(data) {
        return Cron.remote.call("Cron.schedule", data)  
    }

    static async generateId() {
        return Cron.remote.call("Cron.generateId")  
    }
    
    
}

export { Remote };
