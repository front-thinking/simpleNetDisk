$(function() {
	$('#book-list').DataTable({
		"ajax": {
			"url": "/bookList",
			"data": {
				keyword: $("#searchQuery").val()
			},
			"type": "post",
			"dataSrc": "books",
		},
		"responsive": true,
		"columns": [{
			"data": "bookId",
			"width": "77px"
		}, {
			"data": "bookName"
		}, {
			"data": "isbn",
			"width": "86px"
		}],
		"columnDefs": [{
			"targets": 1,
			"data": null,
			"render": function(data, type, full, meta) {
				return '<a target = "_self" href ="/book?_id=' + full._id + '">' + full.bookName + '</a>';
			} //给新闻标题加上链接
		}],
		"oLanguage" : {
			"sLengthMenu" : "每页显示 _MENU_ 条记录",
			"sZeroRecords" : "对不起，查询不到任何相关数据",
			"sInfo" : "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
			"infoEmtpy" : "找不到相关数据",
			"sInfoFiltered" : "数据表中共为 _MAX_ 条记录",
			"sProcessing" : "正在加载中...",
			"sSearch" : "搜索：",
			"sUrl" : "", // 多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : " 前一页 ",
				"sNext" : " 后一页 ",
				"sLast" : " 尾页 "
			}
		}
	});
});