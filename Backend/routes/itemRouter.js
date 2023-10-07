import express from 'express'
import { getItems, addItem } from '../controllers/itemController.js'

const itemRouter = express()

itemRouter.route('/item').get(getItems).post(addItem)

export { itemRouter }
