import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js"
export const createCheckOutSession=async(req,res)=>{

    try{
        const {products,couponCode}=req.body;
        if(Array.isArray(products)||products.length===0){
            return res.status(400).json({error:"invalid or empty products array"})
        }
        let totalAmount=0;
        const lineItems=products.map(product=>{
            const amount=Math.round(product.price*100)

            totalAmount+=amount*product.quantity

            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:product.name,
                        image:[product.image]
                    },
                    unit_amount:amount
                }
            }
        })
        let coupon=null;
        if(couponCode){
            coupon=await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true})

            if(coupon){
                totalAmount-=Math.round(totalAmount*coupon.discountPpercentage/100);
            }
        }
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card",],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts:coupon?[
                {
                    coupon:await createStripeCoupon(coupon.discountPercentage),
                }
            ]:[],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode || "",
                products:JSON.stringify{
                    products.map((p)=>{
                        id:p._id,
                        quantity:p.quantity,
                        price:p.price
                    })
                }
            }
        })
    }
        }) 
    
    if(totalAmount >=2000){
    createNewCoupon(req.user._id)
    }
res.status(200).json({id:session.id,totalAmount:totalAmount/100})
}

    catch(error){
res.staus(500).json({message:"server error",error:error.message})
    }
})

export const checkOutSuccess=async(req,res)=>{
      try{
        const {sessionId}=req.body;
        const session=await stripe.checkout.sessions.retrieve(sessionId)

        if(session.payment_status==="paid"){
            if(session.metadata.CouponCode){
            await Coupon.findOneAndUpdate({
                code:session.metadata.CouponCode,userId:session.metadata.userId
            },{isActive:false})
        }
        }

        const products=JSON.parse(session.metadata.products)
        const newOrder=new Order({
            user:session.metadata.userId,
            products:products.map((product)=>(
                product:product.id,
                quantity:product.quantity,
                price:product.price
            ))
            totalAmount:session.amount_total/100,
            paymentIntent:session.payment_intent,
            stripeSessionId:sessionId
        })
        await newOrder.save();

        res.status(200).json({
            success:true,
            message:"payment successful, orde created and coupom deactivated if used" ,
            orderId:newOrder._id
        })

    }
    catch(error){

        res.status(500).json({message:"server error",error:error.message})

    }
  
})
}

async function createStripeCoupon(discountPercentage) {
    const coupon=await stripe.coupons.create({
        percent_off:discountPercentage,
        duration:"once",
    })

    return coupon.id
    
}

async function createNewCoupon(userId){
    const newCoupon= new coupon({
        code:"GIFT",
        discountPercentage:10,
        expirationDate:new Date(Date.now())
    })

    await newCoupon.save()

    return newCoupon
}
}