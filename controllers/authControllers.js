const User = require('../modal/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// register controller function
const registerUser = async (req, res) => {
    try {
        const { name, password, email, confirmPassword } = req.body;

      

        if (!name || !password ||!email, !confirmPassword) {
            return res.status(400).json({
                errorMessage: "complete all filled",
                success: false
            });
        }



        if (password !== confirmPassword) {
            return res.status(400).json({success: false, errorMessage: 'Passwords do not match' });
          }
        // console.log(req);
        const isExistingUser = await User.findOne({ email: email });
        if (isExistingUser) {
            return res
                .status(409)
                .json({ success: false, errorMessage: "User already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new User({
            name,
            email,
            password: hashedPassword,

        });
        

        await userData.save();
        res.json({
            success: true,
            message: "User registered successfully",
          //  token: token,
            name: userData.name,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

//login controllers functions
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                errorMessage: " Invalid credentials",
            });
        }
      
        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res
                .status(401)
                .json({ success: false, errorMessage: " Please enter valid Email" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "Please enter valid password" });
        }

        const token = jwt.sign(
            { userId: userDetails._id, email: userDetails.email },
            process.env.SECRET_CODE,
            { expiresIn: "20d" }
        );

        res.json({
            success: true,
            message: "Login Successfully",
            token: token,
            email: userDetails.email,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

module.exports = { registerUser, loginUser };