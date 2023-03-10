import { Remote } from "./remote.js"

export class Subscriber {
    static remote = new Remote("https://prefaycmuatwvulxvlof7nwbgi0olwlo.lambda-url.us-east-1.on.aws/")

    static async validate(email) {
        return Subscriber.remote.call("Subscriber.validate", email)  
    }

    static async unsubscribe(email) {
        return Subscriber.remote.call("Subscriber.unsubscribe", email)  
    }

    static async getSubscribers() {
        return Subscriber.remote.call("Subscriber.getSubscribers")  
    }
    
    static async httpResponse(body) {
        return Subscriber.remote.call("Subscriber.httpResponse", body)  
    }

    static async getParam(req, elem) {
        return Subscriber.remote.call("Subscriber.getParam", req, elem)  
    }

    
}

export { Remote };
