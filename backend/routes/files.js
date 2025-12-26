const express = require("express");
const router = express.Router();
const fileController = require("../controllers/filesController");
const authMiddleware = require("../middleware/authMiddleware");
//trasa do obsługi plików które są chronione przez middleware do autoryzacji użytkownika gdzie tylko zalogowani użytkownicy mogą uzyskać dostęp do tych zasobów


router.get("/", authMiddleware, fileController.listFiles); //lista plików (chroniona) która używa middleware do autoryzacji oraz kontrolera do obsługi logiki

module.exports = router; //eksportowanie routera do użycia w server.js ponieważ to jest plik tras i trzeba go zaimportować w głównym pliku serwera