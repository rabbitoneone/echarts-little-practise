//总体思路利用数据驱动视图[{}]
//#addContain 新增按钮 功能
//.del删除功能
//.upd编辑功能 控制类名
//****.yes 编辑成功 .no取消编辑*****/
//右边两块区域图表联动


//数据需求 姓名数组 评分数组 薪资数组
//大的对象包裹以上数据

$(function () {
    //设置节流阀
    let flag = false
    //将图表封装成函数
    function echartInit(obj) {
        let myChart = echarts.init(obj.el);
        let option = {
            title: {
                show: true,
                left: '1%',
                top: '1%',
                text: obj.title,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: obj.trigger,
                transitionDuration: 0
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#fff'
                },
                data: obj.nameArr
            },
            yAxis: {
                type: 'value',
                show: true,
                axisLabel: {
                    color: '#fff'
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                },
            },
            grid: {
                containLabel: true,
                left: '5%',
                right: '2%',
                top: '10%',
                bottom: '3%'
            },
            series: [{
                itemStyle: {
                    color: "#1E90FF"
                },
                data: obj.data,
                type: obj.type
            }]
        };
        myChart.clear();
        myChart.setOption(option)
        $(window).on('resize', function () {
            myChart.resize()
        })
    }

    //将数据封装成函数方便调用 设定返回值方便表调用
    function sectionInit() {
        //遍历之前清空内部的结构
        $('section').empty()
        let nameArr = []
        let scoreArr = []
        let salaryArr = []
        //根据新的数组totalArr生成页面结构
        totalArr.forEach((item, index) => {
            // console.log(item);
            $(` <div class="one" data-index=${index}>
          <span class="item">
            <span class="info">${item.name}</span>
            <input type="text" class="ipt name" value="${item.name}" />
          </span>
          <span class="item">
            <span class="info">${item.score}</span>
            <input type="number" class="ipt name" value="${item.score}" />
          </span>
          <span class="item">
            <span class="info">${item.salary}</span>
            <input type="number" class="ipt name" value="${item.salary}" />
          </span>
          <span class="item">
            <i class="upd"><img src="./imgs/upd.png" alt="" /></i>
            <i class="del" index="1"><img src="./imgs/del.png" alt="" /></i>
            <i class="yes" index="1"><img src="./imgs/yes.png" alt="" /></i>
            <i class="no"><img src="./imgs/no.png" alt="" /></i>
          </span>
        </div>`).appendTo('section')
            nameArr.push(item.name)
            scoreArr.push(item.score)
            salaryArr.push(item.salary)

        })
        return { nameArr, scoreArr, salaryArr }
    }
    //创建一个空数组存储数据
    let totalArr = []

    //1.通过新增按钮 添加数据
    $('#addContain').on('click', function () {
        if (flag) {
            return alert('请完成其他操作')
        }
        //获取姓名 评分 薪资 数据 判断不能为空
        let name = $('input[name="name"]').val().trim()
        let score = $('input[name="score"]').val().trim()
        let salary = $('input[name="salary"]').val().trim()
        if (name.length === 0 || score.length === 0 || salary.length === 0) {
            alert('输入不能有空')
            return
        }
        //添加数据到数据数组中
        totalArr.unshift({
            name,
            score,
            salary
        })
        $('.right .bar').children().show()
        $('.right .line').children().show()
        $('input[name]').val('')
        //传入数据格式 可通用回头想办法封装
        let result = sectionInit()
        nameArr = result.nameArr
        salaryArr = result.salaryArr
        scoreArr = result.scoreArr
        echartInit({
            el: $('.right .bar')[0],
            title: '评分图示',
            type: 'bar',
            nameArr,
            data: scoreArr,
            trigger: 'item'
        })
        echartInit({
            el: $('.right .line')[0],
            title: '薪资图示',
            type: 'line',
            nameArr,
            data: salaryArr,
            trigger: 'axis'
        })

    })
    //2.删除功能
    $('section').on('click', '.del', function () {
        if (flag) {
            return alert('请完成其他操作')
        }

        let index = $(this).parents('.one').attr('data-index')
        totalArr.splice(index, 1)
        if (totalArr.length === 0) {

            $('.right .bar').children().hide()
            $('.right .line').children().hide()
        }
        sectionInit()
        let result = sectionInit()
        nameArr = result.nameArr
        salaryArr = result.salaryArr
        scoreArr = result.scoreArr
        echartInit({ el: $('.right .bar')[0], title: '评分图示', type: 'bar', nameArr, data: scoreArr })
        echartInit({ el: $('.right .line')[0], title: '薪资图示', type: 'line', nameArr, data: salaryArr })
    })
    //.upd编辑功能 控制当前点击的父级one类名
    $('section').on('click', '.upd', function () {
        $(this).parents('.one').addClass('editMode').siblings().removeClass('editMode')
        flag = true
        //获取自定义下标
        let idx = $(this).parent().parent().attr('data-index')
        //进入编辑模式时,表单值为正常模式的值
        //获取编辑模式三个表单        
        let $editName = $(this).parent().parent().find('input').eq(0)
        let $editScore = $(this).parent().parent().find('input').eq(1)
        let $editSalary = $(this).parent().parent().find('input').eq(2)
        //利用自定义下标 对应当前点击元素的数组位置,以此来取值添加
        //达成编辑数据的重置配对
        $editName.val(totalArr[idx].name)
        $editScore.val(totalArr[idx].score)
        $editSalary.val(totalArr[idx].salary)
        $('input[name]').prop('disabled', flag)
    })

    //编辑功能:绑定yes的点击事件 获取数据更改数组内容
    $('section').on('click', '.yes', function () {
        //获取三个表单元素 添加内容值totalArr
        let name = $('.editMode input').eq(0).val().trim()
        let score = $('.editMode input').eq(1).val().trim()
        let salary = $('.editMode input').eq(2).val().trim()
        if (name.length === 0 || score.length === 0 || salary.length === 0) {
            alert('输入不能有空')
            return
        }
        //获取当前one的自定义下标属性
        let idx = $(this).parent().parent().attr('data-index')
        //添加数据到数据数组中
        totalArr.splice(idx, 1, {
            name,
            score,
            salary
        })
        // console.log(totalArr)
        $(this).parents('.one').removeClass('editMode')
        //数组改变重新渲染
        let result = sectionInit()
        nameArr = result.nameArr
        salaryArr = result.salaryArr
        scoreArr = result.scoreArr
        echartInit({ el: $('.right .bar')[0], title: '评分图示', type: 'bar', nameArr, data: scoreArr })
        echartInit({ el: $('.right .line')[0], title: '薪资图示', type: 'line', nameArr, data: salaryArr })
        flag = false
        //退出编辑模式时,开启头部数据新增框
        $('input[name]').prop('disabled', flag)
    })
    //取消编辑
    $('section').on('click', '.no', function () {
        $(this).parents('.one').removeClass('editMode')
        flag = false
        //退出编辑模式时,开启头部数据新增框
        $('input[name]').prop('disabled', flag)
    })

})


