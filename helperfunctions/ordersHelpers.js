const Merchants = require("../models/merchants");
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
        if (product?.productQuantity < 1) {
            return res.status(400).json({ message: "Product quantity cannot be less than 1" });

        }
        if (!product.productId) {
            return res.status(400).json({ message: "Product Id is required" });
        }
        let productDetails = await Products.findOne({ _id: new ObjectId(product.productId) });
        if (!productDetails) {
            return res.status(400).json({ message: "Product does not exist" });
        }
        if (productDetails.productQuantity < product.productQuantity) {
            return res.status(400).json({ message: "Product quantity is less than the quantity requested" });
        }
        console.log(productDetails, "productDetails");


        let productObj = {
            productId: product.productId,
            productName: productDetails.productName,
            productPrice: productDetails.productPrice,
            productQuantity: product.productQuantity,
            productTotal: parseInt(productDetails.productPrice) * parseInt(product.productQuantity),
            productDescription: productDetails.productDescription,
            productBrand: productDetails.productBrand,
            merchantId: productDetails.merchantId,
            merchantNumber: productDetails.merchantNumber,
            productCategory: productDetails.productCategory,
            productStatus: productDetails.productStatus,
            productDiscount: productDetails.productDiscount,
            productTax: productDetails.productTax,
            productShippingCost: productDetails.productShippingCost,
            productShippingWeight: productDetails.productShippingWeight,
            productTags: productDetails.productTags,
            productNumber: productDetails.productNumber,

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
        products: newProducts,
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


exports.doGetOrders = async (req, res) => {
    let role = req.id.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query?.status || "all";
    const startIndex = (page - 1) * limit;
    let count
    console.log(role, "role");
    if (role === "customer" || role === "Customer") {
        let customerId = req.id.customerId
        let orders
        if (status === "all") {
            orders = await OrdersModel.aggregate([{ $match: { customerId: customerId } }, { $sort: { createdAt: -1 } }, { $skip: startIndex }, { $limit: limit }]);
            count = await OrdersModel.countDocuments({ customerId: customerId });
        } else {
            orders = await OrdersModel.aggregate([{ $match: { customerId: customerId, orderStatus: status } }, { $sort: { createdAt: -1 } }, { $skip: startIndex }, { $limit: limit }]);
            count = await OrdersModel.countDocuments({ customerId: customerId, orderStatus: status });
        }
        let pages = Math.ceil(count / limit);
        return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });
    }
    if (role === "admin" || role === "Admin") {
        let customerId = req.query?.customerId
        let merchantId = req.query?.merchantId
        if (customerId) {
            if (status === "all") {
                let orders = await OrdersModel.find({ customerId: customerId }).limit(limit).skip(startIndex);
                let count = await OrdersModel.countDocuments({ customerId: customerId });
                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }
                return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });
            } else {
                let orders = await OrdersModel.aggregate([{ $match: { customerId: customerId, orderStatus: status } }, { $sort: { createdAt: -1 } }, { $skip: startIndex }, { $limit: limit }]);
                let count = await OrdersModel.countDocuments({ customerId: customerId, orderStatus: status });
                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }
                return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });
            }
        } else if (merchantId) {
            if (status === "all") {
                let orders = await OrdersModel.aggregate(
                    [{
                        $unwind: {
                            path: "$products"
                        }
                    }, {
                        $match: {
                            "products.merchantId": merchantId
                        }
                    }, {
                        $group: {
                            _id: "$orderNumber",
                            products: { "$push": "$products" },
                            customerName: { "$first": "$customerName" },
                            customerEmail: { "$first": "$customerEmail" },
                            customerPhone: { "$first": "$customerPhone" },
                            orderStatus: { "$first": "$orderStatus" }
                        }
                    }, {
                        $addFields: {
                            products: {
                                $map: {
                                    "input": "$products",
                                    "as": "product",
                                    "in": {
                                        "$mergeObjects": ["$$product", {
                                            "productTotal": {
                                                "$toDouble": "$$product.productTotal"
                                            }
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $addFields: {
                            "totalOrderAmount": {
                                "$sum": "$products.productTotal"
                            }
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    }, {
                        $skip: startIndex
                    }, {
                        $limit: limit
                    }
                    ]
                )

                let count = await OrdersModel.aggregate(
                    [{
                        $unwind: {
                            path: "$products"
                        }
                    }, {
                        $match: {
                            "products.merchantId": merchantId
                        }
                    }, {
                        $group: {
                            _id: "$orderNumber",
                            products: { "$push": "$products" },
                            customerName: { "$first": "$customerName" },
                            customerEmail: { "$first": "$customerEmail" },
                            customerPhone: { "$first": "$customerPhone" },
                        }
                    }, {
                        $addFields: {
                            products: {
                                $map: {
                                    "input": "$products",
                                    "as": "product",
                                    "in": {
                                        "$mergeObjects": ["$$product", {
                                            "productTotal": {
                                                "$toDouble": "$$product.productTotal"
                                            }
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $addFields: {
                            "totalOrderAmount": {
                                "$sum": "$products.productTotal"
                            }
                        }
                    },
                    {
                        $count: "total"
                    }
                    ]
                )
                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }
                return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });

            } else {
                let orders = await OrdersModel.aggregate([
                    {
                        $unwind: {
                            path: "$products"
                        }
                    }, {
                        $match: {
                            "products.merchantId": merchantId,
                            orderStatus: status
                        }
                    }, {
                        $group: {
                            _id: "$orderNumber",
                            products: { "$push": "$products" },
                            customerName: { "$first": "$customerName" },
                            customerEmail: { "$first": "$customerEmail" },
                            customerPhone: { "$first": "$customerPhone" },
                            orderStatus: { "$first": "$orderStatus" }

                        }
                    }, {
                        $addFields: {
                            products: {
                                $map: {
                                    "input": "$products",
                                    "as": "product",
                                    "in": {
                                        "$mergeObjects": ["$$product", {
                                            "productTotal": {
                                                "$toDouble": "$$product.productTotal"
                                            }
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $addFields: {
                            "totalOrderAmount": {
                                "$sum": "$products.productTotal"
                            }
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    }, {
                        $skip: startIndex
                    }, {
                        $limit: limit
                    }
                ]
                )
                let count = await OrdersModel.aggregate(
                    [{
                        $unwind: {
                            path: "$products"
                        }
                    }, {
                        $match: {
                            "products.merchantId": merchantId,
                            orderStatus: status
                        }
                    }, {
                        $group: {
                            _id: "$orderNumber",
                            products: { "$push": "$products" },
                            customerName: { "$first": "$customerName" },
                            customerEmail: { "$first": "$customerEmail" },
                            customerPhone: { "$first": "$customerPhone" },
                        }
                    }, {
                        $addFields: {
                            products: {
                                $map: {
                                    "input": "$products",
                                    "as": "product",
                                    "in": {
                                        "$mergeObjects": ["$$product", {
                                            "productTotal": {
                                                "$toDouble": "$$product.productTotal"
                                            }
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $addFields: {
                            "totalOrderAmount": {
                                "$sum": "$products.productTotal"
                            }
                        }
                    },
                    {
                        $count: "total"
                    }
                    ]
                )
                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }
                return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });
            }
        } else {
            if (status === "all") {
                
                let orders = await OrdersModel.aggregate([
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $skip: startIndex
                    },
                    {
                        $limit: limit
                    }
                ])
                let count = await OrdersModel.countDocuments();
                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }

                let newOrders = []


                for (let i = 0; i < orders.length; i++) {
                    let newOrder = {}
                    let merchants = []
                    let merchantProducts = []

                    for (let j = 0; j < orders[i].products.length; j++) {
                        if (!merchants.includes(orders[i].products[j].merchantId)) {
                            let merchantName = await Merchants.findOne({ _id: new  ObjectId(orders[i].products[j].merchantId) }).select({merchantName: 1})
                            let merchant = {
                                merchantId: orders[i].products[j].merchantId,
                                merchantNumber: orders[i].products[j].merchantNumber,
                                merchantName: merchantName.merchantName,
                                merchantTotal: 0
                            }
                            merchants.push(merchant)


                        }
                    }
                    console.log(merchants, "merchants");
                    for (let k = 0; k < merchants.length; k++) {
                        let merchantProduct = []
                        for (let l = 0; l < orders[i].products.length; l++) {
                            if (orders[i].products[l].merchantId === merchants[k].merchantId) {
                                let newProduct = {
                                    productId: orders[i].products[l].productId,
                                    productName: orders[i].products[l].productName,
                                    productPrice: orders[i].products[l].productPrice,
                                    productQuantity: orders[i].products[l].productQuantity,
                                    productTotal: orders[i].products[l].productTotal,
                                
                                }
                                let merchant = {
                                    merchantId: orders[i].products[l].merchantId,
                                    merchantNumber: orders[i].products[l].merchantNumber,
                                    merchantName: "",
                                    products: newProduct
                                }

                                merchantProduct.push(merchant)
                            }


                        }
                        // calculate merchant total
                        let merchantTotal = 0
                        merchantProduct.map((product) => {
                            merchantTotal += parseInt(product.products.productTotal)
                        })
                        merchants[k].merchantTotal = merchantTotal

                        console.log(merchantProduct, "merchantProduct ====>><<<<>>>>>");
                        merchantProducts.push(merchantProduct)


                       
                       
                    }
                    console.log(merchantProducts, "merchantProducts********************************");

                    
                    newOrder = {
                        orderNumber: orders[i].orderNumber,
                        products: merchantProducts,
                        customerName: orders[i].customerName,
                        customerEmail: orders[i].customerEmail,
                        customerPhone: orders[i].customerPhone,
                        orderStatus: orders[i].orderStatus,
                        totalOrderAmount: orders[i].totalOrderAmount,
                        merchants: merchants
                    }

                    newOrders.push(newOrder)
                    
                }
                
               
            
            
            
                return res.status(200).json({ status: "SUCCESS", data: newOrders, pages: pages, currentPage: page, count: count });

                
            } else {
                let orders = await OrdersModel.aggregate(
                    [{
                        $match: { orderStatus: status }
                    },
                    {
                        $unwind: {
                            "path": "$products"
                        }
                    }, {
                        $group: {
                            "_id": {
                                "orderNumber": "$orderNumber",
                                "merchantId": "$products.merchantId",
                                "merchantNumber": "$products.merchantNumber",
                                "merchantName": ""
                            },
                            "products": {
                                "$push": "$products"
                            }
                        }
                    }, {
                        $group: {
                            "_id": "$_id.orderNumber",
                            "products": {
                                "$push": {
                                    "merchantId": "$_id.merchantId",
                                    "merchantNumber": "$_id.merchantNumber",
                                    "merchantName": "",
                                    "products": "$products"
                                }
                            }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $skip: startIndex
                    },
                    {
                        $limit: limit
                    }
                    ])

                let count = await OrdersModel.aggregate(
                    [
                        { $match: { orderStatus: status } },
                        {
                            $unwind: {
                                "path": "$products"
                            }
                        }, {
                            $group: {
                                "_id": {
                                    "orderNumber": "$orderNumber",
                                    "merchantId": "$products.merchantId",
                                    "merchantNumber": "$products.merchantNumber",
                                    "merchantName": ""
                                },
                                "products": {
                                    "$push": "$products"
                                }
                            }
                        }, {
                            $group: {
                                "_id": "$_id.orderNumber",
                                "products": {
                                    "$push": {
                                        "merchantId": "$_id.merchantId",
                                        "merchantNumber": "$_id.merchantNumber",
                                        "merchantName": "",
                                        "products": "$products"
                                    }
                                }
                            }
                        },
                        {
                            $count: "total"
                        }

                    ])

                let pages = Math.ceil(count / limit);
                if (orders.length === 0) {
                    return res.status(400).json({ message: "No orders found" });
                }
                return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count });


            }



        }
    }

    if (role === "merchant" || role === "Merchant") {
        let merchantId = req.id.merchantId
        let orders = await OrdersModel.aggregate([
            {
                $unwind: {
                    path: "$products"
                }
            }, {
                $match: {
                    "products.merchantId": merchantId
                }
            }, {
                $group: {
                    _id: "$orderNumber",
                    products: { "$push": "$products" },
                    customerName: { "$first": "$customerName" },
                    customerEmail: { "$first": "$customerEmail" },
                    customerPhone: { "$first": "$customerPhone" },
                    orderStatus: { "$first": "$orderStatus" }

                }
            }, {
                $addFields: {
                    products: {
                        $map: {
                            "input": "$products",
                            "as": "product",
                            "in": {
                                "$mergeObjects": ["$$product", {
                                    "productTotal": {
                                        "$toDouble": "$$product.productTotal"
                                    }
                                }]
                            }
                        }
                    }
                }
            }, {
                $addFields: {
                    "totalOrderAmount": {
                        "$sum": "$products.productTotal"
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }, {
                $skip: startIndex
            }, {
                $limit: limit
            }
        ])
        
        let count = await OrdersModel.aggregate(
            [{
                $unwind: {
                    path: "$products"
                }
            }, {
                $match: {
                    "products.merchantId": merchantId
                }
            }, {
                $group: {
                    _id: "$orderNumber",
                    products: { "$push": "$products" },
                    customerName: { "$first": "$customerName" },
                    customerEmail: { "$first": "$customerEmail" },
                    customerPhone: { "$first": "$customerPhone" },
                    orderStatus: { "$first": "$orderStatus" }

                }
            }, {
                $addFields: {
                    products: {
                        $map: {
                            "input": "$products",
                            "as": "product",
                            "in": {
                                "$mergeObjects": ["$$product", {
                                    "productTotal": {
                                        "$toDouble": "$$product.productTotal"
                                    }
                                }]
                            }
                        }
                    }
                }
            }, {
                $addFields: {
                    "totalOrderAmount": {
                        "$sum": "$products.productTotal"
                    }
                }
            },
            {
                $count: "total"
            }
            ]
        )
        let pages = Math.ceil(count / limit);
        if (orders.length === 0) {
            return res.status(400).json({ message: "No orders found" });
        }
        return res.status(200).json({ status: "SUCCESS", orders: orders, pages: pages, currentPage: page, count: count[0] });

    }

}


function groupOrdersByMerchant(orders) {
    let groupedOrders = [];
  
    // Iterate through each order
    orders.forEach(order => {
      let merchantId = null;
  
      // Iterate through each product in the order to find the merchant ID
      order.products.forEach(product => {
        if (!merchantId) {
          merchantId = product.merchantId;
        }
      });
  
      // Check if the merchant already exists in groupedOrders
      let existingMerchantIndex = groupedOrders.findIndex(merchantOrder => merchantOrder.merchantId === merchantId);
  
      // If the merchant doesn't exist, add it
      if (existingMerchantIndex === -1) {
        groupedOrders.push({
          merchantId: merchantId,
          orderNumbers: [order.orderNumber],
          merchantProducts: order.products,
          merchantTotal: parseInt(order.orderAmount)
        });
      } else {
        // If the merchant exists, update its orders and total
        groupedOrders[existingMerchantIndex].orderNumbers.push(order.orderNumber);
        groupedOrders[existingMerchantIndex].merchantProducts.push(...order.products);
        groupedOrders[existingMerchantIndex].merchantTotal += parseInt(order.orderAmount);
      }
    });
  
    return groupedOrders;
  }