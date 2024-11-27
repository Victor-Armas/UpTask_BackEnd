"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputError = void 0;
const express_validator_1 = require("express-validator");
const handleInputError = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
    return;
};
exports.handleInputError = handleInputError;
//# sourceMappingURL=validation.js.map