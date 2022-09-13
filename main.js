Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
class Pointer {
    constructor(id, x, y, value) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = value;
    };
}
/**
 * @matrix Pointer[]
 */
let matrix = [];
let n = 3;
let AI = 'o';
let human = 'x';
let value = AI;
// let gameOver = false;
// let waiting = false;
let win = 0;
let lost = 0;
let next;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

/**
 * Tạo ma trận
 * @param {number} n kích thước ma trận
 */
function createMatrix(n) {
    for (let x = 1; x <= n; x++) {
        for (let y = 1; y <= n; y++) {
            matrix.push(new Pointer(matrix.length + 1, x, y, null))
        }
    }
}
/**
 * tạo ra giao diện sân chơi từ ma trận
 */
function generateHtmlMatrix() {
    let str = '';
    matrix.forEach(p => {
        str += `<div id=${p.id} onclick="turnPlay(${p.id})" class="grid-item"></div>`;
    })
    document.getElementById('container').innerHTML = str;
}

function start() {
    createMatrix(n);
    console.log(matrix);
    generateHtmlMatrix();
}
start();

/**
 * nhận sự kiện click của người chơi sau mỗi lượt sẽ kểm tra có ai thắng, hoặc hết ô để  chơi chưa, nếu chưa thì random ô tiếp theo (máy chơi)
 * @param {number} id định danh của ô được chọn
 * 
 */
function checkWinner() {
    let winner = null;

    // for (let i = 0; i < winCombos.length; i++) {
    //     if ((matrix[winCombos[i][0]].value == matrix[winCombos[i][1]].value) && (matrix[winCombos[i][1]].value == matrix[winCombos[i][2]].value)) {
    //         winner = matrix[winCombos[i][0]].value;
    //     }
    // }

    // horizontal
    for (let i = 0; i < 7; i++) {
        if (i === 0 || i === 3 || i === 6) {
            if ((matrix[i].value == matrix[i + 1].value) && (matrix[i].value == matrix[i + 2].value)) {
                winner = matrix[i].value;
            }
        }
    }
    // Vertical
    for (let i = 0; i < 3; i++) {
        if ((matrix[i].value == matrix[i + 3].value) && (matrix[i].value == matrix[i + 6].value)) {
            winner = matrix[i].value;
        }
    }
    // // Diagonal
    if ((matrix[0].value == matrix[4].value) && (matrix[0].value == matrix[8].value)) {
        winner = matrix[0].value;
    }
    if ((matrix[2].value == matrix[4].value) && (matrix[4].value == matrix[6].value)) {
        winner = matrix[2].value;
    }


    let openSpots = 0;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].value == null) {
            openSpots++;
        }
    }
    console.log("🚀 ~ file: main.js ~ line 72 ~ checkWinner ~ winner", winner)
    if (winner == null && openSpots == 0) {
        return 'tie';
    } else {
        return winner;
    }
}
// function bestMove() {

//     let bestScore = -Infinity;
//     let move;
//     for (let i = 0; i < matrix.length; i++) {
//         if (matrix[i].value == null) {
//             matrix[i].value = AI;
//             let score = minimax(matrix, 0, false);
//             matrix[i].value = null;
//             if (score > bestScore) {
//                 bestScore = score;
//                 move = { i };
//             }
//         }
//     }
//     return move;

// }
let scores = {
    x: +10,
    o: -10,
    tie: 0
};


function minimax(matrix, depth, isMaxiniming) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result] > 0 ? scores[result] + depth : scores[result] - depth;
    }
    if (isMaxiniming) {
        let bestScore = -Infinity;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i].value == null) {
                matrix[i].value = AI;
                let score = minimax(matrix, depth + 1, false);
                matrix[i].value = null;// xóa vị trí mk vừa đánh đi
                bestScore = Math.max(score, bestScore);
                if (win > bestScore) {
                    bestScore = score;
                    // console.log(i);
                    next = i;
                }
            }
        }
        return matrix[next];
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i].value == null) {
                matrix[i].value = human;
                let score = minimax(matrix, depth + 1, true);
                matrix[i].value = null;
                bestScore = Math.min(score, bestScore);
                if (lost < bestScore) {
                    bestScore = score;
                    // console.log(i);
                    next = i;
                }
            }
        }
        return matrix[next];
    }
}
function turnPlay(id) {
    document.getElementById(id).innerHTML = human;
    matrix[id - 1].value = human;
    minimax(matrix, 0, false);
    document.getElementById(next + 1).innerHTML = AI;
    matrix[next].value = AI;
    let result = checkWinner();
    if (result !== null) {
        let str = '';
        if (result === 'x') {
            str = 'You win';
        }
        if (result === 'o') {
            str = 'You over';
        }
        if (result === 'tie') {
            str = 'You tie';
        }
        document.getElementById('container').innerHTML = str;
    }
}

function reset() {
    matrix = [];
    AI = 'o';
    human = 'x';
    value = AI;
    // gameOver = false;
    // waiting = false;
    start();
}