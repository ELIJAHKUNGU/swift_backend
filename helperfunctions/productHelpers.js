const Business = require("../models/businessModel");
const Merchants = require("../models/merchants");
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
const ProductsModel = require("../models/products");
exports.doCreateProduct = async (req, res) => {
    console.log(req.id, "req.id" );
    let merchantId 
    let businessNumber
    let merchantNumber
    let role = req.id.role;
    console.log(role, "role");
    if(role === "merchant" && role === "Merchant" && role ==="admin"){
        return res.status(400).json({ message: "You are not authorized to create product" });
    }
    if(role === "merchant" || role === "Merchant"){
        merchantId = req.id.merchantId
        businessNumber = req.id.businessNumber
        merchantNumber = req.id.merchantNumber
        
    }
    if(role === "admin"){
        console.log("Admin can create product");
        let merchantId = req.body.merchantId
        if(!merchantId){
            return res.status(400).json({ message: "Merchant Id is required" });
        }
        let merchantDeatils = await Merchants.findOne({ _id:ObjectId(merchantId) });
        if(!merchantDeatils){
            return res.status(400).json({ message: "Merchant does not exist" });
        }
        let businessDetails = await Business.findOne({merchantId:merchantId});
        if(!businessDetails){
            return res.status(400).json({ message: "Business does not exist" });
        }
        businessNumber = businessDetails.businessNumber
        merchantNumber = merchantDeatils.merchantNumber


    }

    const {productName,productImage,  productDescription, productBrand, productCategory, ratings, productPrice, productQuantity, productDiscount, productTax, productShippingCost, productShippingWeight, productFeatures, productTags,} = req.body

    let emptyFields = []
    if(!productName || productName === ""){
        emptyFields.push('productName');
    }
    if(!productDescription || productDescription === ""){
        emptyFields.push('productDescription');
    }
    if(!productBrand || productBrand === ""){
        emptyFields.push('productBrand');
    }
    if(!productCategory){
        emptyFields.push('productCategory');
    }
    if(!productPrice || productPrice === ""){
        emptyFields.push('productPrice');
    }
    if(!productQuantity || productQuantity === ""){
        emptyFields.push('productQuantity');
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ message: `The following fields are required: ${emptyFields.join(', ')}` });
    }
    if(!productImage || productImage.length === 0){
        return res.status(400).json({ message: "Product image is required" });
    }
    let data = {
        productName:productName,
        productImage:productImage,
        productDescription:productDescription,
        productBrand:productBrand,
        merchantId:merchantId,
        merchantNumber:merchantNumber,
        businessNumber:businessNumber,
        productCategory:productCategory,
        ratings:ratings,
        productPrice:productPrice,
        productQuantity:productQuantity,
        productDiscount:productDiscount,
        productTax:productTax,
        productShippingCost:productShippingCost,
        productShippingWeight:productShippingWeight,
        productFeatures:productFeatures,
        productTags:productTags
    }
    await this.createNewProduct(data, req, res);
}


exports.createNewProduct = async (data, req, res) => {
    console.log(data, "data");
    let newProduct =   await ProductsModel.create({
        productName: data.productName,
        productImage: data.productImage,
        productDescription: data.productDescription,
        productBrand: data.productBrand,
        merchantId: data.merchantId,
        merchantNumber: data.merchantNumber,
        businessNumber: data.businessNumber,
        productCategory: data.productCategory,
        ratings: data.ratings,
        productPrice: data.productPrice,
        productQuantity: data.productQuantity,
        productDiscount: data.productDiscount,
        productTax: data.productTax,
        productShippingCost: data.productShippingCost,
        productShippingWeight: data.productShippingWeight,
        productFeatures: data.productFeatures,
        productTags: data.productTags,
        productNumber: await generateProductNumber(),
        productSequence: await getProductSequence()
    }).then(async result => {
        console.log("Product saved successfully:", result);
        return res.status(200).json({status:"SUCCESS", message: 'Product created successfully', productName: result.productName, productImage : result.productImage, productDescription: result.productDescription, productBrand: result.productBrand, merchantId: result.merchantId, merchantNumber: result.merchantNumber, businessNumber: result.businessNumber, productCategory: result.productCategory, ratings: result.ratings, productPrice: result.productPrice, productQuantity: result.productQuantity, productDiscount: result.productDiscount, productTax: result.productTax, productShippingCost: result.productShippingCost, productShippingWeight: result.productShippingWeight, productFeatures: result.productFeatures, productTags: result.productTags, productNumber: result.productNumber });
    }).catch(error => {
        if (error.code === 11000) {
            // Handle duplicate key error here
            console.error("Duplicate key error:", error);
            res.status(400).json({ message: "Product already exists" });
        } else {
            // Handle other errors
            console.error("Error saving product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        return Promise.reject(error);
    });
}

const generateProductNumber = async () => {
    let productSequence = await getProductSequence();
    let productNumber = "P" + productSequence;
    return productNumber;
}

const getProductSequence = async () => {
    let productSequence = 0;
    let product = await ProductsModel.findOne().sort({ productSequence: -1 });
    if (product) {
        productSequence = product.productSequence + 1;
    } else {
        productSequence = 1;
    }
    return productSequence;
}