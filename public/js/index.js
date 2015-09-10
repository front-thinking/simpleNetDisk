$(function() {
    var preSelected;
    var selected = [];
    $(".file-list-item").bind('contextmenu', function(e) {
        e.preventDefault();
        if (selected.length > 1 && selected.indexOf($(this).find("input[type='checkbox']")[0]) !== -1) {

        } else {
            while(selected.length) selected.pop().checked = false;
            $(this).find("input[type='checkbox']")[0].checked = true;
            if (preSelected) preSelected.find("input[type='checkbox']")[0].checked = false;
            preSelected = $(this);
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
    $(".select").bind("click", function() {
        if (this.checked) selected.push(this);
        else selected.splice(selected.indexOf(this), 1);
        console.log(selected);
    });
    $(".file-list").bind('contextmenu', function(e) {
        e.preventDefault();
        $('#mm2').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
    });

    // $("div[action='rename'")
});