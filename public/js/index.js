$(function() {
    var preSelected;
    var selected = [];

    function getFileList() {
        $.getJSON("/fileList", function(results) {
            console.log(results);
            // load a template file, then render it with data
            template.helper('$dealWithSize', function(content) {
                // 处理字符串...
                return (parseInt(content) / 1024).toFixed(2) + "KB";
            });
            var html = template('fileTemplate', results);
            $(".file-list tbody").html(html)
            console.log(html);
        });
    }
    $("body").on('contextmenu', ".file-list-item", function(e) {
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

    $(".select-all").bind("click", function() {
        var that = this;
        $(".select").each(function() {
            this.checked = that.checked;
            selected.push(this);
        });
        if (!that.checked) selected = [];
    });
    $("body").on("click", ".select", function(e) {
        if (e.target.checked) selected.push(e.target);
        else selected.splice(selected.indexOf(e.target), 1);
        console.log(selected);
    });

    $("div[action='open']").click(function() {
        alert(selected[0].id);
    });
    $("div[action='delete']").click(function() {
        var fileNames = [];
        for (var i = 0; i < selected.length; i++) {
            fileNames.push(selected[i].id);
        }
        $.ajax({
            url: "/delete",
            data: {
                fileNames: fileNames.join("; ")
            },
            type: "post",
            dataType: "json",
            success: function(data) {
                if (data.status == "1") {
                    alert("删除成功!");
                } else {
                    alert("删除失败!");
                }
                getFileList();
            }

        });

    });


    getFileList();

});