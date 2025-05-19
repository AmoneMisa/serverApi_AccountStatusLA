import express from 'express';
import User from '../models/Users.js';
import {generateUniqueInviteKey} from "../utils.js";

const router = express.Router();
/**
 * @swagger
 * /subscribers/{inviteKey}:
 *   get:
 *     summary: Получить всех пользователей, подписанных на пользователя с заданным inviteKey
 *     parameters:
 *       - in: path
 *         name: inviteKey
 *         schema:
 *           type: string
 *         required: true
 *         description: Инвайт-код пользователя
 *     responses:
 *       200:
 *         description: Список подписчиков
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nickname:
 *                     type: string
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/subscribers/:inviteKey', async (req, res) => {
    const { inviteKey } = req.params;
    // Проверка существования пользователя с таким inviteKey
    const user = await User.findOne({ inviteKey });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Ищем всех, у кого в settings.online.subs есть этот inviteKey
    const subscribers = await User.find({
        'settings.online.subs': inviteKey
    }, '_id nickname lastUpdateAt inviteKey');

    res.json(subscribers);
});

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

    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) {
        return res.status(404).json({error: 'User not found'});
    }

    const updated = await User.findOneAndUpdate(
        {_id: req.params.id},
        {nickname, settings, lastUpdateAt: Date.now()},
        {new: true});

    res.json({_id: updated["_id"], nickname, settings});
});

/**
 * @swagger
 * /resetInviteKey/{id}:
 *   put:
 *     summary: Сбросить инвайт-код пользователя
 *     description: Генерирует новый уникальный инвайт-код для пользователя по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Новый инвайт-код успешно сгенерирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID пользователя
 *                 inviteKey:
 *                   type: string
 *                   description: Новый инвайт-код
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/resetInviteKey/:id', async (req, res) => {
    const updatedUser = await User.findById(req.params.id);
    if (!updatedUser) {
        return res.status(404).json({error: 'User not found'});
    }

    const inviteKey = await generateUniqueInviteKey();
    await User.findOneAndUpdate(
        {_id: req.params.id},
        {inviteKey},
        {new: true});

    res.json({_id: updatedUser["_id"], inviteKey});
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
 *                 inviteKey:
 *                   type: string
 *                 settings:
 *                   type: object
 */
router.post('/register', async (req, res) => {
    const {nickname, settings} = req.body;

    const inviteKey = await generateUniqueInviteKey();

    const newUser = new User({nickname, settings, inviteKey});
    await newUser.save();

    res.json({_id: newUser["_id"], nickname, settings, inviteKey});
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
 * /key/{key}:
 *   get:
 *     summary: Получить пользователя по inviteKey
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: inviteKey пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       404:
 *         description: Пользователь не найден
 */
router.get('/key/:key', async (req, res) => {
    const user = await User.findOne({inviteKey: req.params.key}, '_id nickname lastUpdateAt inviteKey');
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
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
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
});

export default router;
