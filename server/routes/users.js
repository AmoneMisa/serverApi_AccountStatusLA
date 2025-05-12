import express from 'express';
import User from '../models/Users.js';

const router = express.Router();
/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Обновить пользователя по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - settings
 *             properties:
 *               nickname:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Пользователь обновлён
 *       404:
 *         description: Пользователь не найден
 */

router.put('/update/:id', async (req, res) => {
    const {nickname, settings} = req.body;

    const updatedUser = await User.findOne({_id: req.params.id});
    if (!updatedUser) {
        return res.status(404).json({error: 'User not found'});
    }

    await User.findOneAndUpdate(
        {_id: req.params.id},
        {nickname, settings, lastUpdateAt: Date.now()},
        {new: true});

    res.json({_id: updatedUser["_id"], nickname, settings});
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Зарегистрировать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - settings
 *             properties:
 *               nickname:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 settings:
 *                   type: object
 */
router.post('/register', async (req, res) => {
    const {nickname, settings} = req.body;

    const newUser = new User({nickname, settings});
    await newUser.save();

    res.json({_id: newUser["_id"], nickname, settings});
});

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Получить список всех пользователей (кроме указанного)
 *     parameters:
 *       - in: query
 *         name: exclude
 *         schema:
 *           type: string
 *         description: ID пользователя, которого нужно исключить
 *     responses:
 *       200:
 *         description: Список пользователей
 *       404:
 *         description: Пользователи не найдены
 */
router.get('/all', async (req, res) => {
    const users = await User.find({
        _id: { $ne: req.query.exclude }
    });
    if (!users) {
        return res.status(404).json({error: 'Users not found'});
    }
    res.json(users);
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', async (req, res) => {
    const user = await User.findOne({_id: req.params.id});
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
});

export default router;
