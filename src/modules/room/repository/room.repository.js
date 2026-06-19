import prisma from "../../../config/prisma.js";

class RoomRepository {

    async createRoom(data) {

        return prisma.room.create({
            data
        });

    }

    async addMember(data) {

        return prisma.roomMember.create({
            data
        });

    }

    async findByInviteCode(
        inviteCode
    ) {

        return prisma.room.findUnique({
            where: {
                inviteCode
            }
        });

    }

    async checkMember(
        roomId,
        userId
    ) {

        return prisma.roomMember.findFirst({
            where: {
                roomId,
                userId
            }
        });

    }

    async getRooms(userId) {

        return prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true
                    }
                },
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        });

    }

    async getRoomById(roomId) {

        return prisma.room.findUnique({
            where: {
                id: roomId
            },
            include: {

                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true
                    }
                },

                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true
                            }
                        }
                    }
                },

                _count: {
                    select: {
                        members: true
                    }
                }

            }
        });

    }

    async getRoomMembers(roomId) {

        return prisma.roomMember.findMany({
            where: {
                roomId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        userName: true
                    }
                }
            }
        });

    }

    async getMemberCount(roomId) {

        return prisma.roomMember.count({
            where: {
                roomId
            }
        });

    }

    async getMessages(roomId) {

        return prisma.message.findMany({
            where: {
                roomId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        userName: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });

    }

    async leaveRoom(
        roomId,
        userId
    ) {

        return prisma.roomMember.deleteMany({
            where: {
                roomId,
                userId
            }
        });

    }

    async getLobby(roomId) {

        return prisma.room.findUnique({
            where: {
                id: roomId
            },
            include: {

                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true
                    }
                },

                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true
                            }
                        }
                    }
                },

                _count: {
                    select: {
                        members: true
                    }
                }

            }
        });

    }

}

export default new RoomRepository();