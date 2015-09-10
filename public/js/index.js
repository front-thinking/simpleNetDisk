$(function () {
    var preSelected ;
    var mutliSelected;
    $(".file-list-item").bind('contextmenu', function (e) {
        e.preventDefault();
        $(this).find("input[type='checkbox']")[0].checked = true;
        if(preSelected) preSelected.find("input[type='checkbox']")[0].checked = false;
        preSelected = $(this);
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });
    
    $(".select-all").bind("click", function(){
        var value = $(this).val();
        console.log(value);
        $(".select").each(function(){
            this.chekced = value;
        });
    })
    
     $(".file-list").bind('contextmenu', function (e) {
        e.preventDefault();
        $('#mm2').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
    });
});