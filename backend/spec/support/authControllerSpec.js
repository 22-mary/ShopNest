import { createRegister,getMe, loginUser } from "../../controller/authController.js";
import pool from "../../config/db.js";
import bcrypt from "bcrypt";
import { createToken } from "../../middleware/createTokens.js";

describe('loginUser',()=>{
    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        process.env.JWT_SECRET = 'test-secret';

        req={
            body:{
                name:'mary',
                email:"mary@gmail.com",
                password:"password123"
            }
        }
        json=jasmine.createSpy('json');

        res={
            json: json,
            cookie:jasmine.createSpy('cookie'),
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        };
        next=jasmine.createSpy('next');

        spyOn(pool,'query').and.resolveTo([
            [{
                id:'user1',
                name:'mary',
                email:'mary@gmail.com',
                password:'hashedPassword',

        }]
    ]);

    

    })

    it('login user succesfuly',async()=>{

         spyOn(bcrypt,'compare').and.resolveTo(true);

        await loginUser(req,res,next);

        expect(bcrypt.compare).toHaveBeenCalledWith(
            'password123',
            'hashedPassword'
        );

        expect(res.cookie).toHaveBeenCalledWith(
            'accessToken',
            jasmine.any(String),
            jasmine.objectContaining({
                httpOnly: true,
                sameSite: 'lax',
                secure: false
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Logged In Successfully',
                user:{
                    id:'user1',
                    name:'mary',
                    email:'mary@gmail.com'
                }
            })
        )
    });

    it('rejects login when password is incorect', async()=>{

        spyOn(bcrypt,'compare').and.resolveTo(false);

        await loginUser(req,res,next);
        expect(bcrypt.compare).toHaveBeenCalledWith(
            'password123',
            'hashedPassword'
        );

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Invalid email or password',
                status:400
            })
        );
        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects login when email does not exist', async () => {
        pool.query.and.resolveTo([[]]);

        await loginUser(req, res, next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: 'Invalid email or password',
                status: 400
            })
        );

        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns authenticated user', async()=>{
        req={
            user:{
                id:'user1'

            }
        }
        pool.query.and.resolveTo([
            [{
                id: 'user1',
                name: 'mary',
                email: 'mary@gmail.com',
                role: 'user',
                created_at: '2026-09-02'


            }]
        ]);
        await getMe(req,res,next);
        expect(pool.query).toHaveBeenCalledWith(
            jasmine.stringContaining('SELECT id, name, email,role, created_at'),
            ['user1']
            
        );
        expect(json).toHaveBeenCalledWith({
            user:{

                id: 'user1',
                name: 'mary',
                email: 'mary@gmail.com',
                role: 'user',
                created_at: '2026-09-02'

            }
        })


    });

    it('returns an error when authenticated user is not found',async()=>{
        req={
            user:{
                id:'user1'

            }
        }

        pool.query.and.resolveTo([[]]);

        await getMe(req,res,next);
        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'user not found',
                status:404
            }
            )
        )
        expect(res.json).not.toHaveBeenCalled();
    });

    it('create register successfully',async()=>{
         spyOn(bcrypt, 'hash').and.returnValue(
             Promise.resolve('hashedPassword')
         );

    pool.query.and.returnValues(
            Promise.resolve([[]]),
            Promise.resolve([{insertId:'user1'}])
        )

        await createRegister(req,res,next);
        expect(bcrypt.hash).toHaveBeenCalledWith(
            'password123',
            10
        )

        expect(res.status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith(
            {
            message:'User registered',
            users:{
                id:'user1',
                name:'mary',
                email:'mary@gmail.com'
            }
        }
        )


    });

    it('returns error when create register fails', async()=>{
        pool.query.and.resolveTo([[
            {
                id: 'user1',
                name: 'mary',
                email: 'mary@gmail.com',
                role: 'user',
                created_at: '2026-09-02'


            }
          
        ]]);

        spyOn(bcrypt, 'hash').and.returnValue(
             Promise.resolve('hashedPassword')
         );

        await createRegister(req,res,next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining(
                {
                    message:'Email is already registered',
                    status:400

            }

            )
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(json).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('handles database error during registration', async()=>{
        pool.query.and.rejectWith(new Error('database error'));

        await createRegister(req,res,next);
        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: 'database error'
            })
        );
    });

})