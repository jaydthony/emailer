import { Remote } from "./remote.js"

export class Settings {
    static remote = new Remote("http://127.0.0.1:8083/Settings")

    static async getSettings() {
        return Settings.remote.call("Settings.getSettings")  
    }
    
    static async save(data) {
        return Settings.remote.call("Settings.save", data)  
    }

    static async response(data, ) {
        return Settings.remote.call("Settings.response", data, )  
    }

    
}

export { Remote };
