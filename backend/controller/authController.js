import pool from "../config/db.js";
import express from 'express';
import bcrypt from 'bcrypt';
import {createToken} from "../middleware/createTokens.js";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../middleware/asyncHandler.js";



export const createRegister=asyncHandler(async(req,res)=>{
    
        const{name, email, password}=req.body;
        
        //check if email already exist
        const [existingUser]=await pool.query(
            `SELECT id FROM users
            where email=?
            `,[email]);

            if(existingUser.length>0){
                const error=new Error('Email is already registered');
                error.status=400;
                error.field='email';
                throw error;
            }
        // hash password          
        const hashedPassword=await bcrypt.hash(password,10);

        //insert user
        const id = uuidv4();
        const[result]=await pool.query(
            `INSERT INTO users(
             id,name,email, password) 
            values(?,?,?,?)`,
            [id,name,email,hashedPassword]
            );
        //response
        res.status(201).json({
            message:'User registered',
            users:{
                id:result.insertId,
                name,
                email
            }
        });

    

})



export const loginUser=asyncHandler(async(req,res)=>{
   

        const{email,password}=req.body;

        //fetch user by email
        const [rows]=await pool.query(`SELECT * FROM users
            WHERE email=?  `,
            [email]
        );
        if(rows.length===0){
            const error=new Error('Invalid email or password');
            error.status=400;
            throw error;
        }
        const user=rows[0];
        const dbPassword=user.password;
        //compare password with bcrypt
        const match=await bcrypt.compare(password,dbPassword);

        if(!match){
            const error= new Error('Invalid email or password');
            error.status=400;
            throw error;
        }
        //generate token
        const accessToken=createToken(user);
        //store token in cookie
        res.cookie("accessToken",
            accessToken,
            {maxAge:60*60*24*30*1000,
             httpOnly:true,
             sameSite:'lax',
             secure:false
            }

        )
       //response
        res.status(200).json({
            message:'Logged In Successfully',
            user:{
                id:user.id,
                name:user.name,
                email:user.email
            }

        });

})

export const getMe=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const [rows]=await pool.query(`SELECT id, name, email,role, created_at 
     FROM users WHERE id = ?`,
        [userId]
    );
    if (rows.length===0){
        const error=new Error('user not found');
        error.status=404;
        throw error;
    }
    res.json({user:rows[0]});
});


export const logoutUser=asyncHandler(async(req,res,next)=>{
    
        res.clearCookie('accessToken',
            {
                httpOnly:true,
                sameSite:'lax',
                secure:false
            });
        res.status(200).json({
            msg:'Logged out succesfully'
        });    
    })
