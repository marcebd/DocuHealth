import { PrismaCliente } from '@prisma/client'
import bcrypt from 'bcrypt'

class UserService {
    constructor() {
        this.prisma = new PrismaCliente();
    }

    addUser = async(user) => {
        const SALT_ROUNDS = 12;
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const { password, ...createdUser} = await this.prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
        return createdUser;
    }

    getUsers = () => this.prisma.user.findMany({
        select: {
            id: true,
            username: true,
        },
    });

    getUser = (id) => this.prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            username: true,
        },
    });

    getUserbyUsername = (username) => this.prisma.user.findUnique({
        where: {username},
    });

}

export default UserService;
