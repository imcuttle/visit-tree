const castArray = require("./castArray")
// @ponicode
describe("castArray", () => {
    test("0", () => {
        let callFunction = () => {
            castArray("Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            castArray("Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            castArray("George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            castArray("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            castArray("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            castArray(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
