
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}



var ptER=parseInt(GetQueryString("ptER")||1);
var htER=parseInt(GetQueryString("htER")||7);
var vtEC=parseInt(GetQueryString("vtEC")||2);


var tableData=$("#table").clone().attr("id","table-data");
tableData.find("tr:lt("+htER+")").attr("hide","");
tableData.find("tr td:lt("+vtEC+")").attr("hide","");
var table=$('<div class="table-div data"></div>').append(tableData);
var tableHeader=$("#table").clone().attr("id","table_fix_header");
$(tableHeader).find("tr:gt("+(htER-1)+")").remove();
var tableHead=$('<div class="table-div header"></div>').append(tableHeader);
var widthOfLeft=0;
$("#table").find("tr:eq("+(htER-1)+")").find("td:lt("+vtEC+")").each(function () {
    widthOfLeft+=$(this).outerWidth()
})
var tableLeft=$('<div class="table-div left"></div>').css("width",widthOfLeft+"px").append($("#table").clone().attr("id","table_fix_left"));
var tableHeadLeft=$('<div class="table-div header-left"></div>').css("width",widthOfLeft+"px").append(tableHeader.clone().attr("id","table_fix_header_left"));
var tableTitle = $("#table").clone().attr("id","table_fix_title");
$(tableTitle).find("tr:gt("+(ptER)+")").remove();
$(tableTitle).find("tr:eq("+(ptER)+")").remove();
var tableTitleDiv=$('<div class="table-div header-left"></div>').append(tableTitle);
var box=$('<div class="box"></div>').append(table,tableHead,tableLeft,tableHeadLeft,tableTitleDiv);
$("body").prepend(box);
$("#table").remove();

var selectedCol=[];
var selectedRow=[];
var lastColIdx=-1;
var lastRowIdx=-1;

var $table = $('.data');
var $tableHead = $('.header');
var $tableLeft = $('.left');
$("body").append('<p id="result-span" style="top:'+($table.height()+30)+'">请选择</p>');
//适应滚动条宽度
$table.width(($table.width()+getScrollWidth()))
$table.height(($table.height()+getScrollWidth()))
/*设置同步横向滚动*/
$table.scroll(function (ev) {
    $tableHead.scrollLeft($table.scrollLeft()); // 横向滚动条
    $tableLeft.scrollTop($table.scrollTop());
    if($table.scrollLeft()!=0)
        $tableLeft.addClass("shadow");
    else
        $tableLeft.removeClass("shadow");
    if($table.scrollTop()!=0)
        $tableHead.addClass("shadow");
    else
        $tableHead.removeClass("shadow");
});

$tableHead.find("tr").last().children("td").each(function (index,el) {
    $(el).attr("col-idx",index+1)
}).click(function (e) {
    var colIdx=parseInt($(this).attr("col-idx"));
    if(e.shiftKey&&lastColIdx!=-1){
        for(var i=lastColIdx;i<=colIdx;i++){
            addToCol(i);
        }
    }else{
        if(indexOfArray(selectedCol,colIdx)==-1)
            addToCol(colIdx)
        else
            removeFromCol(colIdx)
    }
    lastColIdx=colIdx;
    refreshResult();
});
$tableLeft.find("tr").find("td:nth-child("+vtEC+")").each(function (index,el) {
    $(el).attr("row-idx",index+1)
}).click(function (e) {
    var rowIdx=parseInt($(this).attr("row-idx"));
    if(e.shiftKey&&lastRowIdx!=-1){
        for(var i=lastRowIdx;i<=rowIdx;i++){
            addToRow(i);
        }
    }else{
        if(indexOfArray(selectedRow,rowIdx)==-1)
            addToRow(rowIdx)
        else
            removeFromRow(rowIdx)
    }
    lastRowIdx=rowIdx
    refreshResult();
});
function addToCol(idx){
    if(indexOfArray(selectedCol,idx)==-1){
        selectedCol.push(idx);
        $tableHead.find("tr").last().children("td:eq("+(idx-1)+")").addClass("selected-light");
        $table.find("tr").each(function () {
            $(this).children("td:eq("+(idx-1)+")").addClass("selected-in-col");
        })
    }
}
function removeFromCol(idx){
    var pos=indexOfArray(selectedCol,idx);
    if(pos>-1){
        selectedCol.splice(pos,1);
        $tableHead.find("tr").last().children("td:eq("+(idx-1)+")").removeClass("selected-light");
        $table.find("tr").each(function () {
            $(this).children("td:eq("+(idx-1)+")").removeClass("selected-in-col");
        })
    }
}
function addToRow(idx){
    if(indexOfArray(selectedRow,idx)==-1){
        selectedRow.push(idx);
        $tableLeft.find("tr:eq("+(idx-1)+")").find("td:nth-child("+vtEC+")").addClass("selected-light");
        $table.find("tr:eq("+(idx-1)+")").children("td").each(function () {
            $(this).addClass("selected-in-row");
        })
    }
}
function removeFromRow(idx){
    var pos=indexOfArray(selectedRow,idx);
    if(pos>-1){
        selectedRow.splice(pos,1);
        $tableLeft.find("tr:eq("+(idx-1)+")").find("td:nth-child("+vtEC+")").removeClass("selected-light");
        $table.find("tr:eq("+(idx-1)+")").children("td").each(function () {
            $(this).removeClass("selected-in-row");
        })
    }
}
function indexOfArray(array,key) {
    var flag=-1;
    for(var i=0;i<array.length;i++){
        if(key==array[i]){
            flag=i;
            break;
        }
    }
    return flag;
}
function refreshResult() {
    var result="";
    if(selectedRow.length==0||selectedCol.length==0){
        $table.addClass("select-row-or-col");
        if(selectedCol.length==0)
            result="已选中"+selectedRow.length+"行";
        else
            result="已选中"+selectedCol.length+"列";
    }else{
        $table.removeClass("select-row-or-col");
        result="已选中"+selectedRow.length+"*"+selectedCol.length+"="+selectedRow.length*selectedCol.length+"个单元格";
    }
    $("#result-span").text(result);
    console.log(selectedCol,selectedRow);
}

function getScrollWidth() {
    var noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll-scroll;
}