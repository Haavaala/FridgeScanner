import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
        required: false
    },
    expirationDate: {
        type: String,
        required: false
    }
})
const Item = mongoose.model('Item', itemSchema, 'items')

export { Item }
