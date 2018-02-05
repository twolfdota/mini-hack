$(document).ready(function () {
    $('.pop').on('click', function () {
        if ($(this).html()) {
            $('.preview').html($(this).html());
            $('.preview').css('min-width', '700').css('min-height', '500');

            $('#chart-modal').modal('show');
        }
    });

    $('#result').on('click', 'button.answer', (event) => {
        var k = $('#questnumb').prop("value");
        const result = k != 4 ? $(event.target).closest("*[name='answer']").attr("value") : $("#result").find('input[name="answer"]').val(); //khai báo đáp án đã chọn trong câu hỏi này(lấy value của cái html object gần nhất có name=answer)
        $(`#q${k}`).attr("value", result);
        var str = $('#point').html();
        var point = parseInt(str, 10);
        var q1 = $('#q1').val();
        var q2 = $('#q2').val();
        var q3 = $('#q3').val();
        var q4 = $('#q4').val();
        var q5 = $('#q5').val();
        var q6 = $('#q6').val();
        console.log(result);
        $.ajax({
            url: `/api/question${k}/` + result, //dùng đáp án đã chọn làm parameter cho api
            type: 'post',
            data: { point, q1, q2, q3, q4, q5, q6 }, //trả về số lượng người đã chơi để dùng trong api
            dataType: "json",
            success: function (nextQuest) {
                if (nextQuest.errMsg) {
                    $(`#error`).html(nextQuest.errMsg);
                }
                else {
                    google.charts.load('current', { 'packages': ['corechart'] });
                    google.charts.setOnLoadCallback(drawVisualization);
                    function drawVisualization() {
                        var data = new google.visualization.DataTable();

                        var newData = [];
                        for (var i = 0; i < nextQuest.statics.length; i++) {
                            if (nextQuest.statics[i].value != result) {
                                var chart = [`${nextQuest.statics[i].value}`, nextQuest.statics[i].count, 'color:blue', nextQuest.scale];
                            }
                            else {
                                var chart = [`${nextQuest.statics[i].value}`, nextQuest.statics[i].count, 'color:red', nextQuest.scale];
                            }
                            newData.push(chart);
                        }
                        data.addColumn('string', 'choice');
                        data.addColumn('number', 'số người chọn');
                        data.addColumn({ type: 'string', role: 'style' });
                        data.addColumn('number', 'giới hạn');

                        for (var i = 0; i < newData.length; i++)
                            data.addRow(newData[i]);
                        var options = {
                            width: 1000,
                            height: 600,
                            title: `câu hỏi ${k - 1}`,
                            vAxis: { title: 'người chọn' },
                            hAxis: { title: 'số (màu đỏ là số bạn chọn)' },
                            seriesType: 'bars',
                            series: { 1: { type: 'line' } }
                        };
                        var chart_div = document.getElementById(`chart${k - 1}`);
                        var chart = new google.visualization.ColumnChart(chart_div);
                        google.visualization.events.addListener(chart, 'ready', function () {
                            chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
                        });


                        chart.draw(data, options);
                    }


                    $(`#error`).html("");

                    k++;
                    $('#questnumb').attr("value", k);
                    $('#point').html(point + parseInt(nextQuest.point));
                    $('#content').html(nextQuest.content);
                    if (k != 4) {
                        if (k == 7) {
                            $('.game-over').hide();
                            $('#result').hide();
                        }
                        else {
                            var str = '<ul>';
                            for (var i = 0; i < nextQuest.result.length; i++) {
                                str += `<li><button name='answer' class='answer' value='${nextQuest.result[i]}'>${nextQuest.result[i]}</button></li>`
                            }
                            str += '</ul>';
                            $('#result').html(str);
                        }
                    }

                    else {
                        $('#result').html('<input type="number" name="answer"><button class="answer">Submit</button>');
                    }
                }
            }
        })

    })
})