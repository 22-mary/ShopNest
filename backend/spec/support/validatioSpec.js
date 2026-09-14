import { validate } from "../../middleware/validate.js";
import { loginSchema, registerSchema} from "../../validator/authValidator.js";

describe('test suite:validate middleware-login',()=>{
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                email: 'mary@gmail.com',
                password: 'password123'
            }
        };

        res = {
            status: jasmine.createSpy('status').and.returnValue({
                json: jasmine.createSpy('json')
            })
        };

        next = jasmine.createSpy('next');
    });

    it('calls next when login data is valid',()=>{
        const validateLogin=validate(loginSchema);
        validateLogin(req,res,next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it('returns 400 when login email is invalid', () => {
        req.body.email = 'invalid-email';

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when password is short', () => {
        req.body.password = '123';

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when email is missing', () => {
        delete req.body.email;

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('test suite: validate middleware-registration',()=>{
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                name:'mary',
                email: 'mary@gmail.com',
                password: 'password123'
            }
        };

        res = {
            status: jasmine.createSpy('status').and.returnValue({
                json: jasmine.createSpy('json')
            })
        };

        next = jasmine.createSpy('next');
    });

    it('calls next when registration data is valid', () => {
        req.body = {
            name: 'Mary',
            email: 'mary@gmail.com',
            password: 'password123'
        };

        const validateRegister = validate(registerSchema);

        validateRegister(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 400 when name is short', () => {
        req.body.name = 'm';

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when login email is invalid', () => {
        req.body.email = 'invalid-email';

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when password is short', () => {
        req.body.password = '123';

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when name is missing', () => {
        delete req.body.name;

        const validateLogin = validate(loginSchema);

        validateLogin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

})