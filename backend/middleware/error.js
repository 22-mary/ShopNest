const errorHandler=(err,req,res,next)=>{

    console.error(err.stack);

    let status=err.status || 500;
    let message=err.message || 'Internal Server Error';
    // Duplicate entry (e.g email already exists)
    if (err.code === 'ER_DUP_ENTRY') {
        status = 400;
        message = 'Duplicate entry';
    }
    //Foreign key error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        status = 400;
        message = 'Invalid reference data';
    }

    return res.status(status).json({
        success: false,
        message,
        field: err.field || null
    });
    
}

export default errorHandler;