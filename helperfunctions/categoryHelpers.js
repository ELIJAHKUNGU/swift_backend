const Category = require("../models/categoryModel");
const Merchants = require("../models/merchants");

exports.doCreateCategory = async (categoryName, categoryDescription, categoryImage, req, res) => {
    let categoryExist = await Category.findOne({ categoryName: categoryName });
    if (categoryExist) {
        return res.status(409).json({ message: 'Category already exists' });
    }
    let newCategory = new Category({
        categoryName: categoryName,
        categoryDescription: categoryDescription,
        categoryImage: categoryImage
    });
    return newCategory.save()
        .then(result => {
            return res.status(200).json({ message: 'Category created successfully', categoryName: result.categoryName, categoryDescription: result.categoryDescription, categoryImage: result.categoryImage });
        })
        .catch(err => {
            return res.status(500).json({ error: err });
        });
};


exports.doGetCategories = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const category = await Category.find().limit(limit).skip(startIndex);
    const count = await Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({ category, totalPages, currentPage: page });
}


exports.doGetCategoryMerchantsAdsProducts = async (req, res) => {


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    let  categories = await Category.aggregate([{
        $lookup: {
            from: "products",
            let: {
                categoryId: "$_id"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$productCategory", {
                            $toString: "$$categoryId"
                        }]
                    }
                }
            }],
            as: "products"
        }
    }, {
        $addFields: {
            productsCount: {
                $cond: {
                    if: {
                        $isArray: "$products"
                    },
                    then: {
                        $size: "$products"
                    },
                    else: 0
                }
            },
        }
    },
    
    {
        $project: {
            categoryName: 1,
            categoryDescription: 1,
            categoryImage: 1,
            productsCount: 1,
            merchants:[]
        }
    }
    ]).limit(limit).skip(startIndex);

    for (let i = 0; i < categories.length; i++) {
        let categoryId= categories[i]._id.toString();
        // console.log(categoryId, "categoryId");
        let merchants = await Merchants.aggregate([
            {
                $match: {
                    category: categoryId
                }
            },{
                $project: {
                    merchantName: 1,

                }
            }
        ]);


        categories[i].merchants = merchants;
    }



    const count = await Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({ categories, totalPages, currentPage: page });


}