exports.checkIfAdmin = async (req, res, next) => {
    let role = req.id.role;
    console.log(role, "<-------role check if admin middleware");
    if (role !== "admin" &&  role !== "Admin") {
        return res.status(401).json({ message: 'Unauthorized to perform task' });
    }
    next();
}