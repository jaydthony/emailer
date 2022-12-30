import { Remote } from "./remote.js"

export class Subscriber {
    static remote = new Remote("http://127.0.0.1:8083/Subscriber")

    static async validate(address) {
        return Subscriber.remote.call("Subscriber.validate", address)  
    }

    static async addSubscription(address) {
        return Subscriber.remote.call("Subscriber.addSubscription", address)  
    }

    static async confirmSubscription(address) {
        return Subscriber.remote.call("Subscriber.confirmSubscription", address)  
    }

    static async unsubscribe(address) {
        return Subscriber.remote.call("Subscriber.unsubscribe", address)  
    }

    static async getSubscribers() {
        return Subscriber.remote.call("Subscriber.getSubscribers")  
    }
    
    
}

export { Remote };
