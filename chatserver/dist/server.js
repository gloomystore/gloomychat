"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 8800;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    console.log(req.baseUrl);
    res.send('Hello, users!');
});
app.get('/api/users', (req, res) => {
    res.send('Hello, users!');
});
