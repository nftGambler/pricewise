"use server"

import { connectToDB } from '../mongoose'
import { scrapeAmazonProduct } from '../scraper';
import Product from '../models/product.model';
import { revalidatePath } from 'next/cache';
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from '../nodemailer';

export async function scrapeAndStoreProduct(string) {

    if(!string) return;

    try {
        connectToDB();

        const scrapedProduct = await scrapeAmazonProduct(string);

        if(!scrapedProduct) return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({url: scrapedProduct.url});

        if(existingProduct) {
            const updatePriceHistory = [
                ...existingProduct.priceHistory,
                {price: scrapedProduct.currentPrice}
            ];


            product = {
                ...scrapedProduct,
                priceHistory: updatePriceHistory,
                lowestPrice: getLowestPrice(updatePriceHistory),
                highestPrice: getHighestPrice(updatePriceHistory),
                averagePrice: getAveragePrice(updatePriceHistory)
            };

        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        );


    revalidatePath(`/products/${newProduct._id}`);

    } catch (error) {
     throw new Error(`Failed to create/update product: ${error.message}`);
    }

}


export async function getProductById(productId) {
    try {

        connectToDB();

        const product = await Product.findOne({_id: productId});
        
        if(!product) return null;

        return product;

    } catch (error) {
        console.log(error)
    }
}


export async function getAllProducts() {
    try {
        connectToDB();

        const products = await Product.find()
        
        return products

    } catch (error) {
        console.log(error)
    }
}


export async function getSimilarProducts(prdouctId) {
    try {
        connectToDB();


        const currenProduct = await Product.findById(prdouctId)

        if(!currenProduct) return null;
        
        const similarProducts = await Product.find({
            _id: { $ne: prdouctId},
        }).limit(3)

        return similarProducts

    } catch (error) {
        console.log(error)
    }
}





export async function addUserEmailToProduct(productId, userEmail) {
    try {
      connectToDB();
  
      const product = await Product.findById(productId);
  
      if (!product) return;
  
      const userExists = product.users.some((user) => user.email === userEmail);
  
      if (!userExists) {
        product.users.push({ email: userEmail }); // Fix typo: change 'user' to 'users'
  
        await product.save();
  
        const emailContent = await generateEmailBody(product, "WELCOME");
  
        await sendEmail(emailContent, [userEmail]);
      }
    } catch (error) {
      console.log("Error sending email:", error);
      throw new Error(`Failed to add user email to product: ${error.message}`);
    }
  }