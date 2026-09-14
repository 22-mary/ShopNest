export function validateRegisterForm(name, email, password, confirmPassword) {

    const errors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    if (!name) {
        errors.name = 'Name is required';
    }

    if (!email) {
        errors.email = 'Email is required';
    } else {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!emailPattern.test(email)) {
            errors.email = 'Enter a valid email';
        }
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
    }

    if (password && confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    const hasError = Object.values(errors).some(error => error !== '');

    return {
        hasError,
        errors
    };
}