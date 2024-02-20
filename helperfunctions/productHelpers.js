exports.doCreateProduct = async (req, res) => {
    console.log(req.id, "req.id" );
   
    const { productName, productDescription, productPrice, productImage, productCategory, productMerchant, productQuantity } = req.body;
}