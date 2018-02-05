const express = require('express');
const Router = express.Router();
const ctrl = require('./Controller.js');
const questionSchema = require("./model/questionModel");
const mongoose = require('mongoose');

Router.get('/', (req, res) => {
    res.render('pages/index');
});

Router.post('/api/question1/:point', (req, res) => {

    ctrl.checkPoint(req.params.point, 17, 1)
        .then(results => {
            var statics = [];

            for (var i = 1; i <= 10; i++) {
                var plength = !results.players ? 0 : results.players.length;
                var count = !results.players ? 0 : results.players.filter(x => parseInt(x.answer1) == i).length;
                var stat = {
                    count: count,
                    value: i
                }
                statics.push(stat);
            }
            var nextQuest = {
                result: [4, 10],
                content: "Chọn 4 để nhận 4 điểm chắc chắn, hoặc chọn 10 và nhận được 10 chỉ khi ít hơn 20% số người chơi cũng chọn 10.",
                point: results.point,
                statics: statics,
                scale: plength * 17 / 100
            }
            res.send(nextQuest);
        })
        .catch(err => console.log(err));

});

Router.post('/api/question2/:point', (req, res) => {


    ctrl.checkPoint(req.params.point, 20, 2)
        .then(results => {
            var plength = !results.players ? 0 : results.players.length;
            var count1 = !results.players ? 0 : results.players.filter(x => parseInt(x.answer2) == 4).length;
            var count2 = !results.players ? 0 : results.players.filter(x => parseInt(x.answer2) == 10).length;
            var statics = [{ count: count1, value: 4 }, { count: count2, value: 10 }];
            var nextQuest = {
                result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                content: "Chọn một số từ 1 đến 10, và nhận số điểm tương ứng - nhưng chỉ khi có ít hơn 13% số người chơi cũng chọn số đó.",
                point: 0,
                statics: statics,
                scale: plength * 20 / 100
            }
            if (req.params.point == 10) {
                nextQuest.point = results.point;
                res.send(nextQuest);
            }
            else {

                nextQuest.point = 4;
                res.send(nextQuest);
            }
        })
        .catch(err => console.log(err));

});

Router.post('/api/question3/:point', (req, res) => {

    ctrl.checkPoint(req.params.point, 13, 3)
        .then(results => {
            var statics = [];
            var plength = !results.players ? 0 : results.players.length;
            for (var i = 1; i <= 10; i++) {
                
                var count = !results.players ? 0 : results.players.filter(x => parseInt(x.answer3) == i).length;
                var stat = {
                    count: count,
                    value: i
                }
                statics.push(stat);
            }
            var nextQuest = {
                result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                content: `Có tổng cộng ${plength} người đã từng chơi game này, theo bạn bao nhiêu người trong số họ đã chiến thắng?`,
                point: results.point,
                statics: statics,
                scale: plength * 13 / 100
            };
            res.send(nextQuest);
        })
        .catch(err => console.log(err));
});

Router.post('/api/question4/:point', (req, res) => {


    ctrl.getWinNumber(req.params.point)
        .then(length => {
            ctrl.getQuestlist()
                .then(list => {
                    var nextQuest = {
                        result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        content: `Chọn một số từ 1 đến 10, và nhận số điểm tương ứng - nhưng chỉ khi có ít hơn 10% số người chơi cũng chọn số đó.`,
                        point: 0,
                        errMsg: ""
                    };
                    if (!Number.isInteger(Number(req.params.point)) || !req.params.point || req.params.point < 0 || req.params.point > list.length) {
                        nextQuest.errMsg = "Invalid input!";
                        res.send(nextQuest);
                    }
                    else {
                        nextQuest.errMsg = "";
                        if (list.length == 0) {
                            nextQuest.point = 0;
                        }
                        else {
                            nextQuest.point = (1 - (Math.abs(length - req.params.point) / list.length)) * 10;
                        }
                        res.send(nextQuest);
                    }
                })
                .catch(error => console.log(error))

        })
        .catch(err => console.log(err))
    // if (err) console.log(err);
    // else {
    //     var count = 0;
    //     count = count + res.length;
    //     if (req.body.answer == count){
    //         nextQuest.point = 10;
    //     }
    // }
    // res.send(nextQuest);
});


Router.post('/api/question5/:point', (req, res) => {

    ctrl.checkPoint(req.params.point, 10, 5)
        .then(results => {
            var statics = [];
            var plength = !results.players ? 0 : results.players.length;
            for (var i = 1; i <= 10; i++) {
                
                var count = !results.players ? 0 : results.players.filter(x => parseInt(x.answer5) == i).length;
                var stat = {
                    count: count,
                    value: i
                }
                statics.push(stat);
            }
            var nextQuest = {
                result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                content: `Chọn một số từ 1 đến 15, và ghi điểm nếu số đó nhỏ hơn trung bình cộng của tất cả những số người chơi đã chọn.`,
                point: results.point,
                statics: statics,
                scale: plength * 10 / 100
            }
            res.send(nextQuest);
        })
        .catch(err => console.log(err));
});

Router.post('/api/question6/:point', (req, res) => {
    ctrl.checkAverage(req.params.point)
        .then(results => {
            var nextQuest = {
                result: [],
                content: ``,
                point: results.point,
            }
            var total = parseInt(req.body.point) + parseInt(results.point);
            ctrl.addQuestion(total, req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5, req.body.q6)
                .then(result => {
                    console.log("new result added successfully!");
                })
                .catch(error => console.log(error));
            nextQuest.content = `Game over, điểm của bạn là ${total}`;
            res.send(nextQuest);
        })
        .catch(err => console.log(err))
});

module.exports = Router;