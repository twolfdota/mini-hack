
// import { resolve } from "path";

const questionSchema = require("./model/questionModel");

//kiểm tra danh sách người đã chơi để tính điểm dựa trên số điểm và tỉ lệ phần trăm (dùng chung cho câu hỏi 1, 2, 3, 5)
const checkPoint = (point, ratio, number) => new Promise((resolve, reject) => {
    var name = 'answer' + number;
    var value = point;
    var query = {};
    query[name] = value;
    questionSchema.find(query, (err, res) => {
        if (err) {
            reject(err);
        } else {
            getQuestlist()
            .then(players => {
                if (players.length == 0) resolve({point:point, plength:0});
                if (players.length > 0 & res.length / players.length < ratio / 100) resolve({point:point, players:players});
                if (players.length > 0 & res.length / players.length > ratio / 100) resolve({point:0, players:players});
            })
            .catch(error => reject(error))

        }
    })
});
//thêm kết quả chơi mới
const addQuestion = (point, q1, q2, q3, q4, q5, q6) => new Promise((resolve, reject) => {
    questionSchema.create({ point: point, answer1: q1, answer2: q2, answer3: q3, answer4: q4, answer5: q5, answer6: q6 }, (err, res) => {
        err ? reject(err) : resolve(res)
    });
});
//lấy danh sách tất cả người đã chơi
const getQuestlist = () => new Promise((resolve, reject) => {
    questionSchema.find({}, (err, res) => {
        err ? reject(err) : resolve(res)
    })
});

const getWinNumber = (input) => new Promise((resolve, reject) => {
    questionSchema.find({ 'point': { $gte: 30 } }, (err, res) => {
        console.log(`There are ${res.length} player won`);
        if (err) {
            reject(err);
        }
        else {
            resolve(res.length);
        }
    })
});

const checkAverage = (input) => new Promise((resolve, reject) => {
    questionSchema.find({}, 'answer6', (err, res) => {
        if (err) { reject(err) }
        else {
            if (res.length == 0) resolve({point:input, players:res});
            else {
                var result = 0;
                var sum = 0;
                for (var i = 0; i < res.length; i++) {
                    sum = sum + res[i].answer6
                }
                result = sum / res.length;
                if (input < result) resolve({point:input, players:res});
                if (input >= result) resolve ({point:0, players:res});
            }
        }
    });

});



module.exports = {
    addQuestion: addQuestion,
    getQuestlist: getQuestlist,
    checkPoint: checkPoint,
    getWinNumber: getWinNumber,
    checkAverage: checkAverage
}