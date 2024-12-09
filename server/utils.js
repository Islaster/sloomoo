const { encoding_for_model } = require("tiktoken");
const axios = require('axios');
const cheerio = require('cheerio');
const pdf = require('pdf-parse');
const fs = require('fs');

module.exports = {
  calculateTokens,
  scrapeWebsite,
  extractPdf
}

// Function to calculate tokens for the current model
function calculateTokens(text, model = "gpt-4-turbo") {
  try {
    // Load the tokenizer for the specified model
    const encoding = encoding_for_model(model);

    // Tokenize the input text
    const tokens = encoding.encode(text);

    // Log the results
    console.log("Model:", model);
    console.log("Input text:", text);
    console.log("Number of tokens:", tokens.length);

    // Cleanup the tokenizer to free memory
    encoding.free();
  } catch (error) {
    console.error("Error with tokenization:", error.message);
  }
};

async function scrapeWebsite(url){

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const text = $('body').text(); // Adjust the selector as needed for better text extraction

    // Save extracted text to a file
    fs.writeFileSync('website_data.txt', text.trim());
    console.log('Website data saved to website_data.txt');
} catch (error) {
    console.error('Error scraping website:', error);
}

}

async function extractPdf(){
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    // Save extracted text to a file
    fs.writeFileSync('pdf_data.txt', data.text.trim());
    console.log('PDF data saved to pdf_data.txt');
} catch (error) {
    console.error('Error extracting PDF:', error);
}
}