import express from "express";
import roomController from "../controllers/room.controller.js";
import authMiddleware from "../../../middlewares/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Room Management
|--------------------------------------------------------------------------
*/

router.post(
    "/create",
    authMiddleware,
    roomController.createRoom
);

router.post(
    "/join",
    authMiddleware,
    roomController.joinRoom
);

router.delete(
    "/:roomId/leave",
    authMiddleware,
    roomController.leaveRoom
);

/*
|--------------------------------------------------------------------------
| User Rooms
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authMiddleware,
    roomController.getRooms
);

router.get(
    "/:roomId",
    authMiddleware,
    roomController.getRoomById
);

/*
|--------------------------------------------------------------------------
| Room Lobby
|--------------------------------------------------------------------------
*/

router.get(
    "/:roomId/lobby",
    authMiddleware,
    roomController.getLobby
);

router.get(
    "/:roomId/members",
    authMiddleware,
    roomController.getRoomMembers
);

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

router.get(
    "/:roomId/messages",
    authMiddleware,
    roomController.getMessages
);

export default router;