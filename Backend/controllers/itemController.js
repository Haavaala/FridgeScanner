import { Item } from "../models/itemSchema.js";
import axios from "axios";
import cheerio from "cheerio";
import pkg from "jsdom";
const { JSDOM } = pkg;

const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

const addItem = async (req, res) => {
  const existingItem = await Item.find({barcode: req.body.barcode}).select();

  if (existingItem.length > 0){
    console.log("Found item in the database!")
  }


  // Setting all required parameters

  // TODO: Find the actual item names (via spar.no els. here)
  // på spar query search er classen med navnet: ws-product__title
  // https://spar.no/sok?query=<barcode>

  let url = "https://allematpriser.no/tilbud/meny:product:" + req.body.barcode;
  let productTitle = "Unknown";

  try {
    // Fetch the page content using axios
    const response = await axios.get(url);

    // Parse the HTML content using jsdom
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Find the <a> element with class "ws-product__title"
    const productTitleElement = document.querySelector("h1");

    // Check if the element was found
    if (productTitleElement) {
      // Get the href attribute and inner text of the <a> element
      productTitle = productTitleElement.textContent;
      console.log("Product Title:", productTitle);
    } else {
      console.log(
        'Element name not found!'
      );
    }
  } catch (error) {
    console.error("Error fetching or extracting content:", error);
  }

  const item = new Item({
    barcode: req.body.barcode,
    name: productTitle,
    amount: 1,
  });


  // Saving the item to the DB
  try {
    if (!existingItem.length > 0){
      const savedItem = await item.save();
      res.status(200).json(savedItem);
    } else {
      let nuAmount = Number(existingItem[0].amount) + 1;
      const savedItem = await Item.findOneAndUpdate({barcode: req.body.barcode},{amount: nuAmount});
      res.status(200).json(savedItem);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

export { getItems, addItem };
