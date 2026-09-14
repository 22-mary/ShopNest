import fs from 'fs/promises';

export async function readOrder() {
    try {
        const dataOrder=await fs.readFile(new URL('../data/orders.json', import.meta.url),
            'utf-8');
            return JSON.parse(dataOrder);
    
        
    } catch (error) {
        console.error('Failed to read orders',error);
        throw error;
        
    }
    
}


export async function writeOrder(orders){
    try {
        await fs.writeFile(
            new URL('../data/orders.json', import.meta.url),
            JSON.stringify(orders, null, 2),
            'utf-8');
        
    } catch (error) {
        console.error('failed to write order', error);
        throw error;
        
    }
    
}