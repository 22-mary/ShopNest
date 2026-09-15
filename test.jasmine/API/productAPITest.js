import { getProduct, loadProductsFetch ,Product} from "../../API/productsAPI.js";

describe('test suite:loadProductFetch',()=>{
    it('loads product successfully',async()=>{
       spyOn(window,'fetch').and.resolveTo({

        ok:true,
        status:200,
        json:async()=>([
            {
            id: 'product-1',
            image: 'images/shirt.jpg',
            name: 'Black T-shirt',
            rating: {
                stars: 45,
                count: 100
            },
            brand: 'Test Brand',
            category: 'Clothing',
            stock: 20,
            description: 'Black T-shirt',
            priceCents: 1999
        },
        {
            id: 'product-2',
            image: 'images/shoes.jpg',
            name: 'Running Shoes',
            rating: {
                stars: 50,
                count: 200
            },
            brand: 'Test Brand',
            category: 'Shoes',
            stock: 15,
            description: 'Running shoes',
            priceCents: 4999
        }
        ])
       });
       const result=await loadProductsFetch();
       expect(fetch).toHaveBeenCalledTimes(1);
       expect(result[0].id).toEqual('product-1');
       expect(result[0].name).toEqual('Black T-shirt');
       expect(result[0].priceCents).toEqual(1999);

       expect(result[1].id).toEqual('product-2');
       expect(result[1].name).toEqual('Running Shoes');
       expect(result[1].priceCents).toEqual(4999);
       expect(result[0] instanceof Product).toBeTrue();
       expect(result[1] instanceof Product).toBeTrue();

    });
    it('throws an error when loading products fails',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
        })
        await expectAsync(loadProductsFetch())
            .toBeRejectedWithError('Failed to fetch products');
        })
    it('searches for a product',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            status:200,
            json:async()=>([{
                id: 'product-1',
                name: 'Black T-shirt',
                priceCents: 1999
            }])
        })
        const result = await loadProductsFetch('T-shirt');

        expect(fetch).toHaveBeenCalledTimes(1);

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/products?search=T-shirt&sort=',
        );

        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual('Black T-shirt');
    })
    it('sorts products by price from lowest to highest', async () => {
    spyOn(window, 'fetch').and.resolveTo({
        ok: true,
        status: 200,
        json: async () => ([
            {
                id: 'product-1',
                name: 'Cheap Product',
                priceCents: 1000
            },
            {
                id: 'product-2',
                name: 'Expensive Product',
                priceCents: 3000
            }
        ])
    });

    const result = await loadProductsFetch('', 'price-asc');

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/products?search=&sort=price-asc'
    );

    expect(result.length).toEqual(2);
    expect(result[0].priceCents).toEqual(1000);
    expect(result[1].priceCents).toEqual(3000);
});
})