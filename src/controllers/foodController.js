import * as model from '../models/foodModel.js';

export const getAll = async (req, res) => {
    try {
        const food = await model.findAll(req.query);

        if (!food || food.length === 0) {
            return res.status(200).json({
                message: 'Nenhum registro encontrado.',
            });
        }
        res.json(food);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const { name, description, price, category, available } = req.body;

        if (!name) return res.status(400).json({ error: 'O nome (name) é obrigatório!' });
        if (!description)
            return res.status(400).json({ error: 'A descrição (description) é obrigatória!' });
        if (!price) return res.status(400).json({ error: 'O preço (price) é obrigatório!' });
        if (!category)
            return res.status(400).json({ error: 'A categoria (category) é obrigatória!' });

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ error: 'O preço deve ser um número positivo!' });
        }

        const validCategories = ['entrada', 'prato principal', 'sobremesa', 'bebida'];
        if (!validCategories.includes(category.toLowerCase())) {
            return res.status(400).json({
                error: `Categoria inválida! Use: ${validCategories.join(', ')}`,
            });
        }

        const data = await model.create({
            name,
            description,
            price: priceNum,
            category: category.toLowerCase(),
            available: available !== undefined ? available : true,
        });

        res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao salvar o registro.' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const { price, category } = req.body;

        // validação que fiz para ver se o preço é válido (positivo e se é um numero)
        if (price !== undefined) {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum <= 0) {
                return res.status(400).json({ error: 'O preço deve ser um número positivo!' });
            }
            req.body.price = priceNum;
        }

        // e essa validação para ver se é valida (uma das pré-definidas)
        if (category !== undefined) {
            const validCategories = ['entrada', 'prato principal', 'sobremesa', 'bebida'];
            if (!validCategories.includes(category.toLowerCase())) {
                return res.status(400).json({
                    error: `Categoria inválida! Use: ${validCategories.join(', ')}`,
                });
            }
            req.body.category = category.toLowerCase();
        }

        const data = await model.update(id, req.body);
        res.json({
            message: `O registro "${data.name}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await model.remove(id);
        res.json({
            message: `O registro "${exists.name}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};
