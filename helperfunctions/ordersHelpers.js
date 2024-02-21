const OrdersModel = require("../models/orders");
const Products = require("../models/products");
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

exports.doCreateOrder = async (req, res) => {
    console.log(req.id, "req.id");
    if (req.id.role !== "Customer" && req.id.role !== "customer") {
        console.log("You are not authorized to create order", req.id.role !== "Customer" || req.id.role !== "customer");
        console.log("You are not authorized to create order", req.id.role);
        return res.status(400).json({ status: "Failed", message: "You are not authorized to create order" });
    }
    let { products, } = req.body;

    let orderSequence = await generateOrderSequence();
    let orderNumber = "ORD_" + orderSequence;
    
    let newProducts = []
    await Promise.all(products.map(async (product) => {
        let productDetails = await Products.findOne({ _id: new ObjectId(product.productId) });
        if (!productDetails) {
            return res.status(400).json({ message: "Product does not exist" });
        }
        if (productDetails.productQuantity < product.quantity) {
            return res.status(400).json({ message: "Product quantity is less than the quantity requested" });
        }

        let productObj = {
            productId: product.productId,
            productName: productDetails.productName,
            productPrice: productDetails.productPrice,
            productQuantity: product.productQuantity,
            productTotal: parseInt(productDetails.productPrice) * parseInt(product.productQuantity)
        }

        newProducts.push(productObj);
    }))

    console.log(newProducts, "newProducts");
    let orderAmount = 0;
    let orderAmountNew = newProducts.map((product) => {
        orderAmount += product.productTotal;
    })
    let orderData = {
        orderNumber: orderNumber,
        orderSequence: orderSequence,
        products: products,
        customerName: req.id.firstName + " " + req.id.lastName,
        customerEmail: req.id.email,
        customerPhone: req.id.phoneNumber,
        customerAddress: req.id.address,
        customerCity: req.id.city,
        customerState: req.id.state,
        customerNumber: req.id.customerNumber,
        userId: req.id.userId,
        customerZipCode: req.id.zipCode,
        paymentType: "Cash",
        orderAmount: orderAmount,
        customerId: req.id.customerId,
    }


    console.log(orderData, "orderData");
    try {
        const createOrder = await createNewOrder(orderData, req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }



}

const createNewOrder = async (orderData, req, res) => {
    let newOrder = new OrdersModel(orderData);
    newOrder.save()
        .then(async result => {
            res.status(200).json({ status: "Success", message: 'Order created successfully', result: result });
        
        })
        .catch(err => { res.status(500).json({ error: err }); });

}


const generateOrderSequence = async () => {
    let orderSequence = 0;
    let order = await OrdersModel.findOne().sort({ orderSequence: -1 });
    if (order) {
        orderSequence = order.orderSequence + 1;
    } else {
        orderSequence = 1;
    }
    return orderSequence;
}

