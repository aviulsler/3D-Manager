const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

const sendResponse = (res, data, statusCode = 200, message = 'Success') => {
    res.status(statusCode).json({
        status: statusCode === 200 ? 'success' : 'error',
        message,
        data,
    });
};

app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        sendResponse(res, null, 500, 'Failed to retrieve items');
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        sendResponse(res, null, 500, 'Failed to retrieve categories');
    }
});

app.get('/api/subcategories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subcategories');
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        sendResponse(res, null, 500, 'Failed to retrieve subcategories');
    }
});

app.get('/api/subcategories/filter', async (req, res) => {
    const { category_id } = req.query;

    if (!category_id) {
        return sendResponse(res, null, 400, 'Category ID is required');
    }

    try {
        const result = await pool.query('SELECT * FROM subcategories WHERE category_id = $1', [category_id]);
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        sendResponse(res, null, 500, 'Failed to retrieve subcategories');
    }
});

app.get('/api/items/filter', async (req, res) => {
    const { subcategory_id } = req.query;

    if (!subcategory_id) {
        return sendResponse(res, null, 400, 'Subcategory ID is required');
    }

    try {
        const result = await pool.query('SELECT * FROM items WHERE subcategory_id = $1', [subcategory_id]);
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        sendResponse(res, null, 500, 'Failed to retrieve items');
    }
});


app.get('/api/items/filter', async (req, res) => {
    const { category_id, subcategory_id } = req.query;

    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (category_id) {
        query += ' AND category_id = $1';
        params.push(category_id);
    }

    if (subcategory_id) {
        query += ' AND subcategory_id = $2';
        params.push(subcategory_id);
    }

    try {
        const result = await pool.query(query, params);
        sendResponse(res, result.rows);
    } catch (error) {
        console.error('Error filtering items:', error);
        sendResponse(res, null, 500, 'Failed to retrieve filtered items');
    }
});

app.post('/api/categories', async (req, res) => {
    const { name } = req.body; // Category name from request body

    if (!name) {
        return sendResponse(res, null, 400, 'Category name is required');
    }

    try {
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        sendResponse(res, result.rows[0], 201, 'Category added successfully');
    } catch (error) {
        console.error('Error adding category:', error);
        sendResponse(res, null, 500, 'Failed to add category');
    }
});

app.post('/api/subcategories', async (req, res) => {
    const { name, category_id } = req.body;

    if (!name || !category_id) {
        return sendResponse(res, null, 400, 'Subcategory name and category_id are required');
    }

    try {
        const result = await pool.query(
            'INSERT INTO subcategories (name, category_id) VALUES ($1, $2) RETURNING *',
            [name, category_id]
        );
        sendResponse(res, result.rows[0], 201, 'Subcategory added successfully');
    } catch (error) {
        console.error('Error adding subcategory:', error);
        sendResponse(res, null, 500, 'Failed to add subcategory');
    }
});

app.post('/api/items', async (req, res) => {
    const { name, subcategory_id, path } = req.body;

    if (!name || !subcategory_id || !path) {
        return sendResponse(res, null, 400, 'Item name, subcategory_id, and path are required');
    }

    try {
        const result = await pool.query(
            'INSERT INTO items (name, subcategory_id, path) VALUES ($1, $2, $3) RETURNING *',
            [name, subcategory_id, path]
        );
        sendResponse(res, result.rows[0], 201, 'Item added successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        sendResponse(res, null, 500, 'Failed to add item');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
