import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../services/auth.js";
import { Session } from "../models/session.js";

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Email in use'));
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);

};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};


export const logoutUser = async (req, res, next) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    return next(createHttpError(400, 'No session ID provided'));
  }

  await Session.deleteOne({ _id: sessionId });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(200).json({ message: 'Logged out successfully' });
};


export const refreshUserSession = async (req, res, next) => {

  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken
  });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Session token expired'));
  }

  await Session.deleteOne({ _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: "Session refreshed" });
};


// У файлі src/controllers/authController.js створіть контролер registerUser, який:

// Перевіряє, чи користувач із таким email вже існує. Якщо так — повертає через createHttpError помилку зі статусом 400 і повідомленням 'Email in use';
// Хешує пароль за допомогою bcrypt;
// Створює нового користувача в базі;
// Створює нову сесію (createSession) і додає кукі (setSessionCookies) до відповіді;
// У разі вдалої обробки запиту повертає відповідь зі статусом 201 і об’єктом створеного користувача (без пароля завдяки методу схеми toJSON) — res.status(201).json(user).



// У файлі src/controllers/authController.js створіть контролер loginUser, який:

// перевіряє, чи користувач із таким email існує в базі даних. Якщо ні — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Invalid credentials';
// перевіряє чи вірний пароль. Якщо ні — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Invalid credentials';
// видаляє стару сесію цього користувача та створює нову (createSession) і додає кукі (setSessionCookies) до відповіді;
// У разі вдалої обробки запиту повертає відповідь зі статусом 200 і об’єктом залогіненого користувача (без пароля завдяки методу схеми toJSON) — res.status(200).json(user).


// У файлі src/controllers/authController.js створіть контролер logoutUser, який:

// перевіряє, чи є у cookies sessionId. Якщо є — видаляє відповідну сесію з бази даних;
// очищає cookies sessionId, accessToken та refreshToken за допомогою res.clearCookie;
// повертає відповідь зі статусом 204 (без тіла).
