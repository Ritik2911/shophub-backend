const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			email,
			password,
			confirmPassword,
		} = req.body;
		// Check if All Details are there or not
		if (
      !email ||
			!password ||
			!confirmPassword
		){
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			password: hashedPassword,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};


// login handler
exports.login = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // find user
    const user = await User.findOne({ email });
    

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please SignUp first",
      });
    }

    // match password check
    if (!(await bcrypt.compare(password, user.password))) {
      // if not matched return
      return res.status(401).json({
        success: false,
        message: "Password is incorrect',",
      });
    }
 
    // password matched successfully

    const payload = {
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // create cookie and send response
    const options = {
      expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("login error ", error);
    return res.status(400).json({
      success: false,
      message: "Login failure, please try again",
    });
  }
};

// change Password
exports.changePassword = async (req, res) => {
  try {
    // get data from req body
    // get old password, new password, confirm password
    const {email,oldPassword, newPassword,confirmPassword} = req.body;
    console.log("old: ", oldPassword)
    console.log("new: ", newPassword)
    console.log("cnf: ", confirmPassword)

    // validate data
    if( !oldPassword || !newPassword || !confirmPassword){
        return res.json({
            success:false,
            message:"All fields are required"
        })
    }

    // match both new password
    if(newPassword !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password Mismatch",
        })
    }

    // fetch original user to match original password with input old password
    const user = await User.findOne({email:email});
    console.log(user)

    if(!(await bcrypt.compare(oldPassword,user.password))){
        // original password mismatch
        return res.status(400).json({
            success:false,
            message:"Wrong Password",
        });
    }
    // original password verified
    // hash new Password
    const hashedPassword = await bcrypt.hash(newPassword,10);

    // update password in DB
    const updatedUser = await User.findOneAndUpdate({email:email},{password:hashedPassword},{new:true});

    // return response
    return res.status(200).json({
        success:true,
        message:"Password changed successfully:"
    });
    
  } catch (error) {
    return res.status(400).json({
        success:false,
        message:"Error while changing password",
        error:error
    });
  }
};
