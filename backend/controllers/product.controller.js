import { client } from "../lib/redis.js";
import Product from "../models/product.model.js"

export const getAllProducts=async(req,res)=>{
    try{
        const products=await Product.find({})
    }
    catch(error){

    }
}

export const getFeaturedProduct=async(req,res)=>{
 try{
 let featuredProducts=await client.get("featured products");
 if(featuredProducts){
    return res.json(JSON.parse(featuredProducts))
 }
 featuredProducts=await Product.find({isFeatured:true}).lean();

 if(!featuredProducts){
    return res.status(404).json({message:"not featured products found"})
 }
 await client.set("featured_products",JSON.stringify(featuredProducts))

 res.json(featuredProducts)
 }
 catch(error)
 {
 console.log("error in getfeatured products controller" ,error.message)
 res.status(500).json({message:"server error",error:error.message})
 }
}