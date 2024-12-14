const logOut = async (req,res) => {
    try {
        // if(req.cookies.jwt) {
        //     res.clearCookie("jwt", {
        //         httpOnly: true, // Giữ an toàn cho cookie
        //         secure: true,   // Nếu bạn dùng HTTPS, có thể giữ flag này
        //         sameSite: "strict", // Tùy chỉnh này để chống tấn công CSRF
        //     });
        // }
        return res.json({
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success:false
        })
    }
}

export default logOut