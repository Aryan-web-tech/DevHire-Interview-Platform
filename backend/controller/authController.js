const pool = require("../db/pool")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async(req,res) =>{
    try{
        console.log(req.body);
        const {email,password} = req.body;

        const userExists = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);

        if(userExists.rows.length == 0)
        {
            return res.status(401).json({message:"User not found"})
        }

        const user = userExists.rows[0]

        const checkPassword = await bcrypt.compare(password,user.password)

        if(!checkPassword)
        {
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user.id, role: user.role, email: email}, 
            process.env.JWT_SECRET , {expiresIn:"2d"})

        res.json({message:"Login successful",token})
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
}

const signup = async (req,res) =>{
    try{
        const {email,password,name,role} = req.body;

        const userExists = await pool.query(`SELECT * FROM users WHERE email=$1`,[email])

        if(userExists.rows.length > 0)
        {
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPass = await bcrypt.hash(password,10)
        
        const newUser = await pool.query(`INSERT INTO users (username,email,password,role)
            VALUES ($1,$2,$3,$4) Returning id`,[name,email,hashedPass,role])

        const userId = newUser.rows[0].id;    

        const token = jwt.sign({id:userId,role:role,email:email},
            process.env.JWT_SECRET,{expiresIn:"2d"})    

        return res.status(201).json({message:"User created",token})    
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
}

module.exports = {login,signup}