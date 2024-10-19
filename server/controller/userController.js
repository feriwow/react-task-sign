const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios")

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FRONT_END_URL = process.env.FRONT_END_URL
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

class UserController {
    static async register(req, res) {
        const { email, password, username } = req.body;

        // checking if all fields is filled
        const missingFileds = [];

        if (!email) missingFileds.push("email");
        if (!password) missingFileds.push("password");
        if (!username) missingFileds.push("username");

        if (missingFileds.length > 0) {
            return res.status(400).json({
                error: `${missingFileds.join(" and ")} ${missingFileds.length > 1 ? "are" : "is"
                    } required`,
            });
        }

        try {
            // check if user already active
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ email }],
                },
            });

            if (existingUser) {
                return res
                    .status(400)
                    .json({ error: "User with this email already exists" });
            }

            // if there the email is different
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(20).toString("hex");

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                    verificationToken,
                    isVerified: false,
                },
            });

            // send verification email
            const verificationLink = `${BASE_URL}/verify-email/${verificationToken}`;

            await transporter.sendMail({
                from: '"React App" <noreply@reactsignapp.com>',
                to: email,
                subject: "Verify your email",
                html: `Please click this link to verify your email: <a href="${verificationLink}">Sign-in</a>`,
            });

            res.status(201).json({
                message:
                    "User created successfully. Please check your email to verify your account.",
                user: {
                    email: user.email,
                    username: user.username,
                },
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Unable to create user" });
        }
    }

    static async verifyEmail(req, res) {
        const { token } = req.params;

        try {
            const user = await prisma.user.findFirst({
                where: { verificationToken: token },
            });

            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Invalid verification token" });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verificationToken: null,
                },
            });

            const jwtToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set the cookie
            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });

            res.redirect(`${FRONT_END_URL}/`);
        } catch (error) {
            console.error("Email verification error:", error);
            res.status(500).json({
                error: "An error occurred during email verification",
            });
        }
    }

    static async resendVerificationEmail(req, res) {
        const { email } = req.body;


        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.isVerified) {
                return res
                    .status(400)
                    .json({ error: "Email is already verified" });
            }

            const now = new Date();
            if (
                user.lastVerificationEmailSentAt &&
                now - user.lastVerificationEmailSentAt < 30000
            ) {
                const timeToWait = Math.ceil(
                    (30000 - (now - user.lastVerificationEmailSentAt)) / 1000
                );
                return res.status(429).json({
                    error: "Rate limit exceeded",
                    message: `Please wait ${timeToWait} seconds before requesting another verification email.`,
                });
            }

            const verificationToken = crypto.randomBytes(20).toString("hex");
            const verificationLink = `${BASE_URL}/verify-email/${verificationToken}`;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationToken,
                    lastVerificationEmailSentAt: now,
                },
            });

            await transporter.sendMail({
                from: '"Your App" <noreply@yourapp.com>',
                to: email,
                subject: "Verify your email",
                html: `Please click this link to verify your email: <a href="${verificationLink}">Sign-in</a>`,
            });

            res.json({ message: "Verification email sent successfully" });
        } catch (error) {
            console.error("Resend verification email error:", error);
            res.status(500).json({
                error: "An error occurred while resending the verification email",
            });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        
        try {
            const user = await prisma.user.findUnique({ where: { email } });          
            

            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }

            if (!user.isVerified) {
                return res.status(401).json({
                    error: "Please verify your email before logging in",
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            

            if (!isPasswordValid) {
                
                return res
                    .status(401)
                    .json({ error: "Invalid email or password" });
            }

            // Increment login count
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    loginCount: { increment: 1 },
                    lastLoginAt: new Date(),
                    lastActiveAt: new Date()
                },
            });

            const token = jwt.sign(
                { username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );


            res.cookie("token", token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600000,
            });

            res.json({ message: "Login successful" });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "An error occurred during login" });
        }
    }

    static async googleLogin(req, res) {
        const { token } = req.body;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const { email, name, given_name } = payload;

            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                // If the user doesn't exist, create a new one
                user = await prisma.user.create({
                    data: {
                        email,
                        username: given_name || name,
                        isVerified: true, 
                        authProvider: 'GOOGLE',
                        password: "secret-pass"
                    }
                });
            } else if (user.authProvider !== 'GOOGLE') {
                return res.status(400).json({ error: "An account with this email already exists using a different login method" });
            }

            const jwtToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', jwtToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });

            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                }
            });
        } catch (error) {
            console.error("Google login error:", error);
            res.status(500).json({ error: "An error occurred during Google login" });
        }
    }

    static async facebookLogin(req, res) {
        const { accessToken } = req.body;
        try {
            // Verify the access token with Facebook
            const fbResponse = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`);
            const { id, name, email } = fbResponse.data;

            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                // If the user doesn't exist, create a new one
                user = await prisma.user.create({
                    data: {
                        email,
                        username: name,
                        isVerified: true,
                        authProvider: 'FACEBOOK',
                        password:"secret-pass"
                    }
                });
            } else if (user.authProvider !== 'FACEBOOK') {
                // If the user exists but used a different auth method before
                return res.status(400).json({ error: "An account with this email already exists using a different login method" });
            }

            const jwtToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', jwtToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });

            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                }
            });
        } catch (error) {
            console.error("Facebook login error:", error);
            res.status(500).json({ error: "An error occurred during Facebook login" });
        }
    }

    static async logout(req, res) {
        try {
            const { email } = req.user

            await prisma.user.update({
                where: { email },
                data: { lastLogoutAt: new Date() }
            })

            res.cookie("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(0),
            });

            res.json({ message: "Logged out successfully" });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'An error occurred during logout' });
        }
    }

    static async resetPassword(req, res) {
        const { email } = req.user;
        const { oldPassword, newPassword } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isOldPasswordValid) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }

            if (oldPassword === newPassword) {
                return res.status(400).json({ error: "New password must be different from the current password" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                },
            });

            res.json({ message: "Password has been reset successfully" });
        } catch (error) {
            console.error("Password reset error:", error);
            res.status(500).json({
                error: "An error occurred while resetting the password",
            });
        }
    }

    static async profile(req, res) {
        try {
            const { email, username } = req.user;
            const user = await prisma.user.findUnique({ where: { email } });

            res.json({
                email: email,
                username: username,
                authProvider: user.authProvider
            });

        } catch (error) {
            console.error("Error in /profile route:", error);
            res.status(500).json({
                error: "An error occurred while fetching the profile",
            });
        }
    }

    static async changeName(req, res) {
        const { username } = req.body
        try {
            const { email } = req.user
            const user = await prisma.user.findUnique({ where: { email } });
            await prisma.user.update({
                where: { email },
                data: {
                    username: username,
                },
            });

            res.json({ message: "Username has been change" });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }


        } catch (error) {

        }
    }

    static async getUserActivity(req, res) {
        try {
            const { email } = req.user;
            const users = await prisma.user.findMany({
                select: {
                    email: true,
                    username: true,
                    createdAt: true,
                    loginCount: true,
                    lastLogoutAt: true
                }
            });

            const userActivityData = users.map(user => ({
                email: user.email,
                username: user.username,
                signUpTimestamp: user.createdAt,
                loginCount: user.loginCount,
                lastLogoutTimestamp: user.lastLogoutAt,
            }));

            res.json(userActivityData);
        } catch (error) { }
    }

    static async getUserAnalytics(req, res) {
        try {
            const totalUsers = await prisma.user.count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const activeUsersToday = await prisma.user.count({
                where: {
                    lastActiveAt: {
                        gte: today
                    }
                }
            });

            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const activeUsersLast7Days = await prisma.user.groupBy({
                by: ['lastActiveAt'],
                where: {
                    lastActiveAt: {
                        gte: sevenDaysAgo
                    }
                },
                _count: {
                    id: true
                }
            });

            const averageActiveUsers = activeUsersLast7Days.reduce((sum, day) => sum + day._count.id, 0) / 7;

            res.json({
                totalSignups: totalUsers,
                activeUsersToday: activeUsersToday,
                averageActiveUsers: Math.round(averageActiveUsers * 100) / 100
            });
        } catch (error) {
            console.error('Get user analytics error:', error);
            res.status(500).json({ error: 'An error occurred while fetching user analytics' });
        }
    }
}

module.exports = UserController;
