import roomRepository from "../repository/room.repository.js";
import crypto from "crypto";

class RoomService {

    async generateInviteCode() {

        let inviteCode;
        let exists = true;

        while (exists) {

            inviteCode = crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();

            exists =
                await roomRepository.findByInviteCode(
                    inviteCode
                );

        }

        return inviteCode;
    }

    async createRoom(
        userId,
        payload
    ) {

        const inviteCode =
            await this.generateInviteCode();

        const room =
            await roomRepository.createRoom({
                roomName: payload.roomName,
                inviteCode,
                createdBy: userId
            });

        await roomRepository.addMember({
            roomId: room.id,
            userId
        });

        return room;

    }

    async joinRoom(
        userId,
        inviteCode
    ) {

        const room =
            await roomRepository.findByInviteCode(
                inviteCode
            );

        if (!room) {
            throw new Error(
                "Room not found"
            );
        }

        const exists =
            await roomRepository.checkMember(
                room.id,
                userId
            );

        if (exists) {
            throw new Error(
                "Already joined"
            );
        }

        const memberCount =
            await roomRepository.getMemberCount(
                room.id
            );

        if (memberCount >= 6) {
            throw new Error(
                "Room is full"
            );
        }

        await roomRepository.addMember({
            roomId: room.id,
            userId
        });

        return room;

    }

    async getRooms(userId) {

        return roomRepository.getRooms(
            userId
        );

    }

    async getRoomById(
        roomId,
        userId
    ) {

        const member =
            await roomRepository.checkMember(
                roomId,
                userId
            );
        
        console.log("LINE119", member);
        

        if (!member) {

            throw new Error(
                "Access denied"
            );

        }

        return roomRepository.getRoomById(
            roomId
        );

    }

    async getRoomMembers(roomId) {

        return roomRepository.getRoomMembers(
            roomId
        );

    }

    async getMessages(roomId) {

        return roomRepository.getMessages(
            roomId
        );

    }

    async leaveRoom(
        roomId,
        userId
    ) {

        const member =
            await roomRepository.checkMember(
                roomId,
                userId
            );

        if (!member) {

            throw new Error(
                "You are not a member of this room"
            );

        }

        await roomRepository.leaveRoom(
            roomId,
            userId
        );

        return {
            message:
                "Successfully left room"
        };

    }

    async getLobby(
        roomId,
        userId
    ) {

        const member =
            await roomRepository.checkMember(
                roomId,
                userId
            );

        if (!member) {

            throw new Error(
                "Access denied"
            );

        }

        return roomRepository.getLobby(
            roomId
        );

    }

}

export default new RoomService();