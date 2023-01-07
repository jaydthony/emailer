import { Remote } from "./remote.js"

export class Settings {
    static remote = new Remote("https://45vsp77vnd5zkqlkmsi265i5qm0tpqzi.lambda-url.us-east-1.on.aws/")

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
