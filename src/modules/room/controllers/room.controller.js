import roomService from "../services/room.services.js";

class RoomController {

    async createRoom(req, res) {

        try {

            const result =
                await roomService.createRoom(
                    req.user.id,
                    req.body
                );

            return res.status(201).json({
                success: true,
                data: result
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async joinRoom(req, res) {

        try {

            const result =
                await roomService.joinRoom(
                    req.user.id,
                    req.body.inviteCode
                );

            return res.json({
                success: true,
                data: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    async getRooms(req, res) {

        const rooms =
            await roomService.getRooms(
                req.user.id
            );

        return res.json({
            success: true,
            data: rooms
        });

    }

    async getRoomById(req, res) {

        try {

            const room =
                await roomService.getRoomById(
                    Number(req.params.roomId),
                    req.user.id
                );

            return res.json({
                success: true,
                data: room
            });

        } catch (error) {

            return res.status(403).json({
                success: false,
                message: error.message
            });

        }

    }

    async getRoomMembers(req, res) {

        const members =
            await roomService.getRoomMembers(
                Number(req.params.roomId)
            );

        return res.json({
            success: true,
            data: members
        });

    }

    async getMessages(req, res) {

        const messages =
            await roomService.getMessages(
                Number(req.params.roomId)
            );

        return res.json({
            success: true,
            data: messages
        });

    }

    async leaveRoom(req, res) {

        try {

            const result =
                await roomService.leaveRoom(
                    Number(req.params.roomId),
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    async getLobby(req, res) {

        try {

            const lobby =
                await roomService.getLobby(
                    Number(req.params.roomId),
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                data: lobby
            });

        } catch (error) {

            return res.status(403).json({
                success: false,
                message: error.message
            });

        }

    }

}

export default new RoomController();