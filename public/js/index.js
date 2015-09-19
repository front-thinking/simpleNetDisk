$(function () {
    var preSelected;//
    var selected = [];//存放选中文件元素
    window.workDir = "/";//当前工作目录

    //生成文件导航
    function generateBreadcrumbNav(workDir) {
        var nav = workDir.replace(/\/$/, "").split("/");
        var breadcrumb = "";
        for (var i = 0; i < nav.length; i++) {

            breadcrumb += '<li><a class="breadcrumb-nav" href="#' + (i === 0 ? "/" : nav.slice(0, i + 1).join("/")) + '">' + (i === 0 ? "Home" : nav[i]) + "</a></li>";
        }
        $(".breadcrumb").html(breadcrumb);
    }

    //右键生成菜单
    $("body").on('contextmenu', "#file-list tbody tr", function (e) {
        e.preventDefault();
        if (selected.length > 1 && selected.indexOf($(e.currentTarget).find("input[type='checkbox']")[0]) !== -1) {

        } else {
            var current = $(e.currentTarget).find("input[type='checkbox']")[0];
            while (selected.length) selected.pop().checked = false;
            selected.push(current);
            current.checked = true;
            if (preSelected) preSelected.checked = false;
            preSelected = e.currentTarget;

        }
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });

    //增加或者去除选中元素
    $(".select-all").bind("click", function () {
        var that = this;
        selected = [];
        $(".select").each(function () {
            this.checked = that.checked;
            if(that.checked) selected.push(this);
        });
        console.log(selected);
    });

    //增加或者去除选中元素
    $("body").on("click", ".select", function (e) {
        if (e.target.checked) selected.push(e.target);
        else selected.splice(selected.indexOf(e.target), 1);
        console.log(selected);
    });

    //删除选中元素
    $("div[action='delete']").click(function () {
        var fileNames = [];
        for (var i = 0; i < selected.length; i++) {
            fileNames.push(workDir + selected[i].id);
        }
        $.ajax({
            url: "/delete",
            data: {
                fileNames: fileNames.join("; ")
            },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.status == "1") {
                    dialog({
                        title: '提示',
                        content: '删除成功！',
                        okValue: '确定',
                        width: 250,
                        ok: function () {
                        }
                    }).showModal();
                } else {
                    dialog({
                        title: '提示',
                        content: '删除失败！',
                        okValue: '确定',
                        width: 250,
                        ok: function () {
                        }
                    }).showModal();
                }
                table.ajax.url('/fileList?dir=' + workDir).load();
            }

        });

    });

    $("div[action='rename']").click(function () {
        var file = $(selected[0]).parent().parent().find("span").attr("contenteditable", "true").focus();
        file.data("filename", file.html());
        $(selected[0]).parent().parent().find(".fa").removeClass("hide");
    });

    $("div[action='moveto']").click(function () {
        var d = dialog({
            title: '移动到',
            content: '按钮回调函数返回 false 则不许关闭',
            okValue: '确定',
            ok: function () {
                this.title('提交中…');
                return false;
            },
            cancelValue: '取消',
            cancel: function () { }
        });
        d.showModal();
    });
     $("div[action='download']").click(function () {
       var fileNames = [];
        for (var i = 0; i < selected.length; i++) {
            fileNames.push(workDir + selected[i].id);
        }
        window.location.href = "/download?fileNames=" +  fileNames.join("; ");
    });
    $("body").on("click", " .fa", function () {
        var file = $(this).parent().find("span");
        if ($(this).hasClass("fa-check")) {
            var originalName = workDir + file.data("filename");
            var currentName = workDir + file.text();
            $.ajax({
                url: "/rename",
                data: {
                    originalName: originalName.trim(),
                    currentName: currentName.trim()
                },
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.status == "1") {
                        dialog({
                            title: '提示',
                            content: '重命名成功！',
                            okValue: '确定',
                            width: 250,
                            ok: function () {
                            }
                        }).showModal();
                    } else {
                        dialog({
                            title: '提示',
                            content: '重命名失败！',
                            okValue: '确定',
                            width: 250,
                            ok: function () {
                            }
                        }).showModal();
                    }
                }
            });
        }
        file.removeAttr("contenteditable");
        $(this).parent().find(".action.fa").addClass("hide");
    });

    //
    $("body").on("click", ".dir", function () {
        var dir = $(this).text().trim() + "/";
        workDir += dir;
        workDir = workDir.replace(/\/+/g, "\/");
        generateBreadcrumbNav(workDir);
        table.ajax.url('/fileList?dir=' + workDir).load();
    });

    //
    $("body").on("click", ".breadcrumb-nav", function () {
        var dir = $(this).attr("href").replace(/^#/, "") + "/";
        workDir = dir.replace(/\/+/g, "\/");;
        generateBreadcrumbNav(workDir);
        table.ajax.url('/fileList?dir=' + workDir).load();
    });

    //渲染文件table
    var table = $('#file-list').DataTable({
        "ajax": {
            "url": "/fileList",
            "data": {

            },
            "type": "get",
            "dataSrc": "fileList",
        },
        "responsive": true,
        "columns": [{
            "data": 8,
            "width": "20px"
        },
            {
                "data": 8
            },
            {
                "data": 4,
                "width": "86px"
            }, {}],
        "aaSorting": [[1, "desc"]],
        "columnDefs": [{
            "targets": 0,
            "data": null,
            "bSortable": false,
            "render": function (data, type, full, meta) {
                if (full[0][0] == "d") {
                    return '<input type="checkbox" class="select"' + 'id="' + data + '-type-d">';
                } else {
                    return '<input type="checkbox" class="select"' + 'id="' + data + '">';
                }
            }
        }, {
                "targets": 1,
                "data": null,
                "render": function (data, type, full, meta) {
                    if (full[0][0] == "d") {
                        return '<i class="fa fa-folder-o"></i>&nbsp;&nbsp;<span class="filename"><a href = "javascript:void(0)" class="dir">' + data + '</a></span>' +
                            '<i class="fa fa-check hide action"></i><i class="fa fa-times hide action"></i>'
                    } else {
                        return '<i class="fa fa-file-o"></i>&nbsp;&nbsp;<span class="filename">' + data + '</span>' + '<i class="fa fa-check hide action"></i><i class="fa fa-times hide action"></i>';
                    }

                }
            },
            {
                "targets": 2,
                "data": null,
                "render": function (data, type, full, meta) {
                    return (parseInt(data) / 1024).toFixed(2) + "KB";
                }
            }, {
                "targets": 3,
                "data": null,
                "render": function (data, type, full, meta) {
                    return full[5] + full[6] + "日" + full[7];
                }
            }],
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "infoEmtpy": "找不到相关数据",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sProcessing": "正在加载中...",
            "sSearch": "搜索：",
            "sUrl": "", // 多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": " 前一页 ",
                "sNext": " 后一页 ",
                "sLast": " 尾页 "
            }
        }
    });
    
    
    // 文件上传
    var $list = $('#thelist'),
        $btn = $('#ctlBtn'),
        state = 'pending',
        uploader;
    uploader = WebUploader.create({

        // 不压缩image
        resize: false,
        auto: true,
        // swf文件路径
        swf: '/js/Uploader.swf',

        // 文件接收服务端。
        server: '/upload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',
        fileVal: 'myfile',
        formData: {
            dir: ""
        }
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        $list.append('<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });
    uploader.on('uploadBeforeSend', function (block, data) {
        // 修改data可以控制发送哪些携带数据。
        data.dir = window.workDir;

    });
    uploader.on('uploadSuccess', function (file) {
        $('#' + file.id).find('p.state').text('已上传');
        table.ajax.url('/fileList?dir=' + workDir).load();
    });

    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    uploader.on('all', function (type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }
    });

});

