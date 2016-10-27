$(function () {
    var cols = 10;
    var rows = 20;
    var i = 0;
    var j = 0;
    var k = 0;
    var arr = [];
    var txt = $("input");
    txt.val(0);
    var currentBlock = { type: 0, cells: [] };
    var BA = document.getElementById("Background-AudioPlayer");//背景音乐
    var SA = document.getElementById("Score-AudioPlayer");//得分特效音
    var GA = document.getElementById("GameOver-AudioPlayer");//游戏结束特效音

    function Map() {
        for (i = 0; i < rows; i++) {
            arr[i] = [];// why it is single dimension ???
            for (var j = 0; j < cols; j++) {
                arr[i][j] = $("<div>");
                arr[i][j].css('top', i * 28 + "px");
                arr[i][j].css('left', j * 28 + "px");
                arr[i][j].attr("class", "plaint");
                $(".container").append(arr[i][j]);
            }
        }
        //BA.load();
        BA.play();
    }

    function newBlock() {
        type = Math.ceil(Math.random() * 5);
        currentBlock.type = type;
        switch (type) {
            case 1:
                currentBlock.cells = [[0, cols / 2 - 2], [0, cols / 2 - 1], [0, cols / 2], [0, cols / 2 + 1]];
                break;
            case 2:
                currentBlock.cells = [[0, cols / 2 - 2], [0, cols / 2 - 1], [0, cols / 2], [1, cols / 2 - 2]];
                break;
            case 3:
                currentBlock.cells = [[1, cols / 2 - 1], [1, cols / 2], [1, cols / 2 + 1], [0, cols / 2]];
                break;
            case 4:
                currentBlock.cells = [[0, cols / 2 - 1], [0, cols / 2], [1, cols / 2 - 1], [1, cols / 2]];
                break;
            case 5:
                currentBlock.cells = [[0, cols / 2 - 1], [0, cols / 2], [1, cols / 2], [1, cols / 2 + 1]];
                break;
        }
        for (var i = 0; i < currentBlock.cells.length; i++) {
            if (arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].hasClass("fixed")) {
                finish();
                clearInterval(timer);
                $(document).keydown = null;//Is it necessary？？？？？？？？？？？？？？？？？？？？？
                return;
            }
        }
        for (i = 0; i < currentBlock.cells.length; i++) {
            arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].attr("class", "active");//???
        }
    }

    function finish() {
        BA.pause();
        //GA.load();
        GA.play();
        alert("Game over!");
        window.location.reload();
    }

    function GetFullLine() {
        var aResult = [];
        for (var i = 0; i < rows; i++) {
            var count = 0;
            for (var j = 0; j < cols; j++) {
                if (arr[i][j].hasClass("fixed")) { count++; }
                if (count == cols) { aResult.push(i); }
            }
        }
        return aResult;
    }

    function GoDown() {
        var i = 0;
        for (i = 0; i < currentBlock.cells.length; i++) {
            if (currentBlock.cells[i][0] + 1 == rows || arr[currentBlock.cells[i][0] + 1][currentBlock.cells[i][1]].hasClass("fixed")) {
                for (i = 0; i < currentBlock.cells.length; i++) {
                    arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].attr("class", "fixed");
                }
                newBlock();

                var fullLines = GetFullLine();
                if (fullLines.length) {
                    clearLines(fullLines);
                    txt.val(parseInt(txt.val()) + fullLines.length);
                }
            }
        }
        clear();//Is the sequence right？？？？？？？？？？？？？？？？？？？？？

        for (i = 0; i < currentBlock.cells.length; i++) {
            currentBlock.cells[i][0]++;
        }

        fresh();
    }

    function clear() {
        for (var i = 0; i < currentBlock.cells.length; i++) {
            arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].attr("class", "plaint");
        }
    }

    function fresh() {
        for (var i = 0; i < currentBlock.cells.length; i++) {
            arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].attr("class", "active");
        }
    }

    function clearLines(arg) {
        for (i = 0; i < arg.length; i++) {
            for (j = arg[i]; j > 0; j--) {
                for (k = 0; k < cols; k++) {
                    arr[j][k].attr("class", arr[j - 1][k].attr("class"));//How to make this ？？？？？？？？？？？？？？
                }
            }
        }
        //SA.load();
        SA.play();
    }

    /*	function findMax(arg){
            var xMax=0;
            var yMax=0;
            for(var i=0;i<currentBlock.cells.length;i++){
                if(xMax<currentBlock.cells[i][0]){xMax=currentBlock.cells[i][0];}
                if(yMax<currentBlock.cells[i][1]){yMax=currentBlock.cells[i][1];}
            }
            return{x:xMax,y:yMax};
        }
    	
        function findMin(arg){
            var xMin=99999;
            var yMin=99999;
            for(var i=0;i<currentBlock.cells.length;i++){
                if(xMin>currentBlock.cells[i][0]){xMin=currentBlock.cells[i][0];}
                if(yMin>currentBlock.cells[i][1]){yMin=currentBlock.cells[i][1];}
            }
            return{x:xMin,y:yMin};
        }*/

    function checkLeft() {
        for (var i = 0; i < currentBlock.cells.length; i++) {
            if (currentBlock.cells[i][1] <= 0 || arr[currentBlock.cells[i][0]][currentBlock.cells[i][1] - 1].hasClass("fixed")) {
                return false;
            }
        }
        return true;
    }

    function checkRight() {
        for (var i = 0; i < currentBlock.cells.length; i++) {
            if (currentBlock.cells[i][1] >= cols - 1 || arr[currentBlock.cells[i][0]][currentBlock.cells[i][1] + 1].hasClass("fixed")) {
                return false;
            }
        }
        return true;
    }

    /*	function ration(){//too difficult code ration
            var tmp=0;
            var oMin=findMin(currentBlock.cells);
            var aNew=[];
            var bNew=[];
            var aTmp=[];
    
            for(i=0;i<currentBlock.cells.length;i++){
                aNew[i]=[currentBlock.cells[i][0]-oMin.x, currentBlock.cells[i][1]-oMin.y];
                bNew[i]=[4-aNew[i][1], aNew[i][0]];
            }
    
            var oMinTmp=findMin(bNew);
    
            for(i=0;i<bNew.length;i++){
                bNew[i][0]-=oMinTmp.x;
                bNew[i][1]-=oMinTmp.y;
                //alert(aNew2[i]);
            }
    
            aNew=bNew;
    
            for(i=0;i<currentBlock.cells.length;i++){
                aTmp[i]=[oMin.x+aNew[i][0], oMin.y+aNew[i][1]];
            }
    
            for(i=0;i<currentBlock.cells.length;i++){
                if(aTmp[i][0]<0 || aTmp[i][0]>=rows || aTmp[i][1]<0 || aTmp[i][1]>=cols || arr[aTmp[i][0]][aTmp[i][1]].hasClass("fixed")){
                    return;
                }
            }
    
            for(i=0;i<aTmp.length;i++){
                currentBlock.cells[i]=aTmp[i];
            }
        }//too difficult code */

    function checkPos() {
        if (currentBlock.cells[i][0] < 0 || currentBlock.cells[i][0] >= rows || currentBlock.cells[i][1] < 0 || currentBlock.cells[i][1] >= cols || arr[currentBlock.cells[i][0]][currentBlock.cells[i][1]].hasClass("fixed")) {
            return;
        }
    }

    function ration() {
        var cBlock = [];
        for (i = 0; i < currentBlock.cells.length; i++) {
            cBlock[i] = currentBlock.cells[i];
        }
        //console.log(cBlock);
        if (currentBlock.type == 4) {
            return;
        } else {
            var i = 0;
            var tmp = 0;
            var gapX = cBlock[1][1] - 0;//posY
            var gapY = cBlock[1][0] - 0;//posX
            /*			var tmpArr=[];
                        for (i = 0; i <currentBlock.cells.length ; i++) {
                            tmpArr[i]=currentBlock.cells[i];
                        }*/
            for (i = 0; i < cBlock.length; i++) {
                /*				if(currentBlock.cells[i][0]-gapY<0 || currentBlock.cells[i][0]-gapY>=rows || currentBlock.cells[i][1]-gapX<0 || currentBlock.cells[i][1]-gapX>=cols || arr[currentBlock.cells[i][0]-gapY][currentBlock.cells[i][1]-gapX].hasClass("fixed")){
                                    return false;
                                }else {*/
                cBlock[i][1] -= gapX;
                cBlock[i][0] -= gapY;
                // }
            }
            /*			for(i=0;i<currentBlock.cells.length;i++){
                            currentBlock.cells[i][1]-=gapX;
                            currentBlock.cells[i][0]-=gapY;
                        }*/
            for (i = 0; i < cBlock.length; i++) {
                tmp = cBlock[i][0];
                cBlock[i][0] = cBlock[i][1];
                cBlock[i][1] = -tmp;
            }
            for (i = 0; i < cBlock.length; i++) {
                /*				if(currentBlock.cells[i][0]+gapY<0 || currentBlock.cells[i][0]+gapY>=rows || currentBlock.cells[i][1]+gapX<0 || currentBlock.cells[i][1]+gapX>=cols || arr[currentBlock.cells[i][0]+gapY][currentBlock.cells[i][1]+gapX].hasClass("fixed")){
                                    return false;
                                }else {*/
                cBlock[i][1] += gapX;
                cBlock[i][0] += gapY;
                //}
            }
            //console.log(cBlock);
            for (i = 0; i < cBlock.length; i++) {
                if (cBlock[i][0] < 0 || cBlock[i][0] >= rows || cBlock[i][1] < 0 || cBlock[i][1] >= cols || arr[cBlock[i][0]][cBlock[i][1]].hasClass("fixed")) {
                    return;
                }
            }
            for (i = 0; i < cBlock.length; i++) {
                currentBlock.cells[i] = cBlock[i];
            }
        }
    }

    /*	Array.prototype.dup=function (arr)
        {
            return [].concat(arr);
        }*/

    $(document).keydown(function (e) {
        switch (e.keyCode) {
            case 65:
                if (checkLeft()) {
                    clear();
                    for (i = 0; i < currentBlock.cells.length; i++) {
                        currentBlock.cells[i][1]--;
                    }
                    fresh();
                }
                break;
            case 68:
                if (checkRight()) {
                    clear();
                    for (i = 0; i < currentBlock.cells.length; i++) {
                        currentBlock.cells[i][1]++;
                    }
                    fresh();
                }
                break;
            case 83:
                GoDown();
                break;
            case 87:
                clear();
                ration();
                fresh();
                break;
            default:
                break;
        }
    });

    Map();
    newBlock();
    var timer = setInterval(GoDown, 1000);
});