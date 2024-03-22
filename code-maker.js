const express = require("express");
const app = express();
const port = 8887;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const secretCode = []

app.get("/createCode", (_req, res) => {

    const colorArray = ["red", "blue", "green"];
    secretCode.length = 0
    for (i = 0; i < 4; i++) {
        secretCode.push(colorArray[Math.floor(Math.random() * 3)]);
    }

    res.json({ secretCode: secretCode })
});

app.get("/retrieve", (req, res, next) => {
    const input = req.query;
    var guessedCode = [];
    var blackCount = 0;

    for (const key in input) {
        guessedCode.push(input[key])
    }
    const colorCount = {
        "red": 0,
        "blue": 0,
        "green": 0
    }
    const result = []

    for (let key in secretCode) {
        colorCount[secretCode[key]] = colorCount[secretCode[key]] + 1
    }
    for (let i = 0; i < secretCode.length; i++) {
        if (secretCode[i] === guessedCode[i]) {
            result.push({ color: guessedCode[i], result: 'B' })
            colorCount[guessedCode[i]] = colorCount[guessedCode[i]] - 1
        } else {
            result.push({ color: guessedCode[i], result: '-' })
        }
    }
    for (let i = 0; i < secretCode.length; i++) {
        if (colorCount[guessedCode[i]] !== 0 && result[i].result === '-') {
            result[i].result = 'W'
            colorCount[guessedCode[i]] = colorCount[guessedCode[i]] - 1
        }
    }


    for (let key of result) {
        if (key.result == "B") {
            blackCount++
        }
    }

    if (isWinner(blackCount)) {
        res.json({ colorCount: colorCount, secretCode: secretCode, msg: "winner", result: result });
        res.end()
    } else {
        res.json({ colorCount: colorCount, secretCode: secretCode, msg: guessedCode, result: result });
    }
});

function isWinner(blackCount) {
    if (blackCount == 4) {
        return true;
    } else {
        return false;
    }
}

app.use((req, res, next) => {
    res.send({ msg: 'No such routes!!' })
});

app.listen(8887, () => console.log(`Server running at localhost: ${port}!`));

