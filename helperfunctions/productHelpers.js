exports.doCreateProduct = async (req, res) => {
    console.log(req.id, "req.id" );
    res.send("Done");
    const { productName, productDescription, productPrice, productImage, productCategory, productMerchant, productQuantity } = req.body;
}