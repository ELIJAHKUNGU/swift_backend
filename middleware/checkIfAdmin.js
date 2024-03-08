exports.checkIfAdmin = async (req, res, next) => {
    let role = req.user.role;
    if (role !== "admin" || role !== "Admin") {
        return res.status(401).json({ message: 'Unauthorized to perform task' });
    }
    next();
}