import {readFile, writeFile} from "node:fs/promises"

function ValidateProduct (product) {

    if (product === undefined ){
        return { valid: false, message: 'Es obligatorio enviar un producto' };
    }

    if (Object.keys(product).length === 0) {
        return { valid: false, message: 'El producto no puede estar vacio, los campos obligatorios son: nombre,precio,descripcion,disponible' };
    }

    if (product.nombre === undefined || typeof product.nombre !== 'string'){
        return { valid: false, message: 'El nombre del producto es obligatorio' };
    }
    if (product.precio === undefined){
        return { valid: false, message: 'El precio del producto es obligatorio' };
    }
    if (product.disponible === undefined){
        return { valid: false, message: 'La disponibilidad del producto es obligatorio' };
    }
    if (product.descripcion === undefined || typeof product.descripcion !== 'string'){
        return { valid: false, message: 'La descripcion del producto es obligatorio' };
    }

    const parsedPrecio = Number(product.precio);
   
    if (isNaN(parsedPrecio)){
        return { valid: false, message: 'El precio debe ser un numero' };
    }

    if (parsedPrecio < 0){
        return { valid: false, message: 'El precio debe ser mayor que 0' };
    }

    if (product.nombre.length < 2){
        return { valid: false, message: 'El nombre del producto debe tener al menos 2 caracteres' };
    }

    if (product.descripcion.trim().length <= 9){
        return { valid: false, message: 'La descripcion del producto debe tener al menos 10 caracteres' };
    }

    if (typeof product.disponible !== 'boolean') {
        return { valid: false, message: 'La disponibilidad debe ser un valor booleano es decir true o false' };
    }

    return { valid: true };

}

async function readProducts() {
    try {
        const data = await readFile('./local_db/products.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeProducts(products) {
    try {
        await writeFile('./local_db/products.json', JSON.stringify(products, null, 2));
    } catch (error) {
        throw new Error('Error al guardar los productos: ' + error.message);
    }
}

export default class ProductController{

    static async getAllProducts(req,res){
        
        const products = await readProducts();

        res.status(200).json(products);
    }

    static async searchById(req,res) {

        const { id } = req.params;
        const parsedId = Number(id);

        if (isNaN(parsedId)){
            return res.status(400).json({ message: 'El ID debe ser un número' });
        }

        const products = await readProducts();

        const product = products.find((product) => {
            return product.id === parsedId;
        });

        if (!product){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product);

    }

    static async getProductsAvailable(req,res){

        const products = await readProducts();

        const productsAvailables = products.filter((product) => {
            return product.disponible === true
        })

        if (productsAvailables.length === 0){
            return res.status(404).json({ message: 'No hay productos disponibles' });
        }

        res.status(200).json({
            productsAvailables
        })
    }

    static async createProduct(req,res){

        const validation = ValidateProduct(req.body);

        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        const {nombre,precio,descripcion,disponible} = req.body;

        const fecha_ingreso = new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString('en-GB')

        const products = await readProducts();

        let maxID = 0 
        
        products.forEach((product) => {
            if (product.id > maxID){
                maxID = product.id;
            }
        })

        const id = maxID + 1;
        
        const newProduct = {
            id,
            nombre,
            precio,
            descripcion,
            disponible,
            fecha_ingreso
        };

        products.push(newProduct);

        await writeProducts(products).then(() => {
            res.status(201).json({
                message: 'Producto creado correctamente',
                product: newProduct
            });
        }).catch((error) => {
            res.status(500).json({ message: 'Error al guardar el producto: ' + error.message });
        });
        
            
    }

    static async updateProduct(req, res) {

        const { id } = req.params
        const parsedId = Number(id)

        if (isNaN(parsedId)){
            return res.status(400).json({ message: 'El ID debe ser un número' });
        }

        const data = req.body;

        const validation = ValidateProduct(data);

        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        const products = await readProducts();

        const productIndex = products.findIndex((product) => {
            return product.id === parsedId;
        });

        if (productIndex === -1){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const updatedProduct = {
            id: parsedId, 
            ...data,
            fecha_ingreso: products[productIndex].fecha_ingreso
        };

        products[productIndex] = updatedProduct;

        await writeProducts(products).then(() => {
            res.status(200).json({
                message: 'Producto actualizado correctamente',
                product: updatedProduct
            });
        }).catch((error) => {
            res.status(500).json({ message: 'Error al guardar el producto: ' + error.message });
        });

    }

    static async deleteProductById(req,res){
        const { id } = req.params;
        const parsedId = Number(id);

        if (isNaN(parsedId)){
            return res.status(400).json({ message: 'El ID debe ser un número' });
        }

        const products = await readProducts();

        const productIndex = products.findIndex((product) => {
            return product.id === parsedId;
        });

        if (productIndex === -1){
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        products.splice(productIndex, 1);

        await writeProducts(products).then(() => {
            res.status(200).json({
                message: 'Producto eliminado correctamente'
            });
        }).catch((error) => {
            res.status(500).json({ message: 'Error al eliminar el producto: ' + error.message });
        });

    }
}