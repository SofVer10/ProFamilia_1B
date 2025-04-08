const logoutController = {};

logoutController.logoutController = async (req, res) => {
    res.clearCookie("authToken");

    return res.json({ message: "Se cerró sesión"})
};

export default logoutController;