var encrypt = new JSEncrypt();
encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1gr+rIfYlaNUNLiFsK/Knb54nQrCRTRMOdujTwkpqKLo4pNYj2StmryWETeFxOCFtCt/7ixTUrU2RGGjkIOlYC3144h0dJKDtPXw9+mFyW1VwWvtfoiSUeKTEbz1tSHghEcdEvVq6qlSQukiLAEZabiwfEE30TQ6g979X6YXhnQIDAQAB");
// encrypt.encrypt($('.couponcode').val());

var template = 'https://cc.shcccoupon.com/cmp'
//点击验证
$('.Verification').on('click', function () {
    var couponcode = $('.couponcode').val()
    if (couponcode == '' || couponcode.length < 16) {
        $('.cwcode').show().delay(3000).fadeOut();
        return;
    }

    //发送ajax
    $.ajax({
        type: "post",
        dataType: 'json',
        // url: "http://192.168.1.205:8998/cmp/serial/verifyCouponCode",

        url: template + "/serial/verifyCouponCode",
        data: JSON.stringify({
            'code': encrypt.encrypt($('.couponcode').val())
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        },
        success: function (res) {
            $('.alert').show().text('验证成功').delay(3000).fadeOut()
            if (res.success == false) {
                $('.alert').show().text(res.errorMsg).delay(3000).fadeOut()
            }
            if (res.data.need_account == 0) {
                //没有第三方账号
                $('.phoneExchange').css('display', 'block');
                $('.couponcode').css('display', 'none');
                $('.Verification').css('display', 'none');
            }
            if (res.data.need_account == 1) {
                //有第三方账号
                $('.thirdExchange').css('display', 'block');
                $('.couponcode').css('display', 'none');
                $('.Verification').css('display', 'none');
            }

        }
    });


})
//点击关闭模态框
$('.cancel').on('click', function () {
    $('#myModal').modal('hide');
})
$('.cancel1').on('click', function () {
    $('#myModal1').modal('hide');
})


//没有第三方账号的兑换
$('.confirm1').on('click', function (e) {
    e.preventDefault();
    var phone = $('.num1').val()
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (phone == '' || !myreg.test(phone)) {
        $('.tsxx').show().delay(3000).fadeOut()
        return
    }
    $('#myModal').modal('show');
    $('.phone1').text('确认将券码：'+$('.couponcode').val()+'，兑换至账号：' + phone + '吗？');


    $('.confirm').on('click', function () {
        //发送ajax
        $.ajax({
            type: "post",
            dataType: 'json',
            url: template + "/serial/exchangeCoupon",
            data:JSON.stringify( {
                'phone': encrypt.encrypt($('.num1').val()),
                'code': $('.couponcode').val()
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function (data) {
                if (data.success == false) {
                    $('.alert').show().text(data.errorMsg).
                    delay(3000).
                    fadeOut()
                    $('#myModal').modal('show');
                    $('.phoneExchange').css('display', 'block')
                } else {
                    $('.alert').show().text('兑换成功').delay(3000).fadeOut()
                    $('#myModal').modal('hide')
                    $('.phoneExchange').css('display', 'block')
                }
            }
        })
    })

})


//有第三方账号的兑换
$('.confirm2').on('click', function (e) {
    e.preventDefault();
    var phone1 = $('.num2').val()
    var qqnum = $('.qqnum').val()
    var qqreg = /[1-9][0-9]{4,14}/
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (phone1 == '' || !myreg.test(phone1)) {
        $('.tsxx').show().delay(3000).fadeOut()
        return;
    } else if (qqnum == '' || !qqreg.test(qqnum)) {
        $('.qqtsxx').show().delay(3000).fadeOut()
        return;
    }
    $('#myModal1').modal('show')
    $('.phone2').text('确认将券码：'+$('.couponcode').val()+'，兑换至账号：' + qqnum + '吗？');
    $('.confirm3').on('click', function () {
        //发送ajax
        $.ajax({
            type: "post",
            dataType: 'json',
            url: template + "/serial/exchangeCoupon",
            data:JSON.stringify( {
                'phone': encrypt.encrypt($('.num2').val()),
                'code': $('.couponcode').val(),
                'account': $('.qqnum').val(),
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function (data1) {
                if (data1.success == false) {
                    $('.alert').show().text(data1.errorMsg).
                    delay(3000).
                    fadeOut()
                    $('.thirdExchange').css('display', 'block');
                    $('#myModal1').modal('show')
                    // $('#myModal2').modal('hide')
                } else {
                    $('.alert').show().text('兑换成功').delay(3000).fadeOut()
                    // $('thirdExchange').modal('hide')
                    $('#myModal1').modal('hide')
                    $('.thirdExchange').css('display', 'block');
                }
            },
            error: function (res) {
                // alert(res)
            }

        })
    })


})

//活动规则 遮罩层
$('.rule').on('click', function () {
    $('#bg').show()
    $("#show").show()
})
$('#btnclose').on('click', function () {
    $('#bg').hide()
    $("#show").hide()
})