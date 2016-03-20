var sketch=angular.module('sketch',[]);
sketch.controller('sketchController', ['$scope', function($scope){
	$scope.canvasWH={width:1000,height:500};


	$scope.strokeStyle="#00ff00";
	$scope.csState={
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:1,
		style:'stroke'
	}
	$scope.setStyle=function(s){
		$scope.csState.style=s;
	}

	var canvas=document.querySelector('#canvas');
	var ctx=canvas.getContext('2d');
	var clearCanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var previous;
	var setmousemove={
		line:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		arc:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				var r=Math.abs(ev.offsetX-e.offsetX);
				ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
				//ctx[$scope.csState.style]();
				if($scope.csState.style=='fill'){
					ctx.fill();
				}
				else{
					ctx.stroke();
				}
			}
		},
		pen:function(e){
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		rect:function(e){
			canvas.onmousemove=function(ev){
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				var w=ev.offsetX-e.offsetX;
				var h=ev.offsetY-e.offsetY;
				if($scope.csState.style=='fill'){
					ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
					ctx.fill();
				}
				else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
					ctx.stroke();
				}
				
			}
		},
		erase:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		}

	}
	$scope.tool='line';
	$scope.tools={
		'画线':'line',
		'橡皮':'erase',
		'矩形':'rect',
		'画笔':'pen',
		'圆':'arc',
	};
	$scope.settool=function(tool){
		$scope.tool=tool;
	}
	canvas.onmousedown=function(e){
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		ctx.style=$scope.csState.style;
		setmousemove[$scope.tool](e);
		document.onmouseup=function(){
			canvas.onmousemove=null;
			previous=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}
	}


	$scope.save=function(ev){
		if(previous){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download='mypic.png';
		}
		else{
			alert('空画布');
		}
	}
	$scope.newSketch=function(){
		if(previous){
			if(confirm('是否保存')){
				location.href=canvas.toDataURL();
			}
		}
		clearCanvas();
		previous=null;
	}




/*	 分别绘制 直线 圆 矩形 的思路
	canvas.onmousedown=function(e){
		canvas.onmousemove=function(ev){
			clearCanvas();
			if(previous){
				ctx.putImageData(previous,0,0);
			}
			ctx.beginPath();
			//ctx.moveTo(e.offsetX,e.offsetY);
			//ctx.lineTo(ev.offsetX,ev.offsetY);
			//直线
			//var r=Math.abs(ev.offsetX-e.offsetX);
			//ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
			//圆
			var w=ev.offsetX-e.offsetX;
			var h=ev.offsetY-e.offsetY;
			ctx.strokeRect(e.offsetX,e.offsetY,w,h);
			//矩形
			ctx.stroke();
		}
		document.onmouseup=function(){
			canvas.onmousemove=null;
			previous=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}
	}
*/
/*  存储 截图 思路
	var current;
	canvas.onmousedown=function(e){
		canvas.onmousemove=function(ev){
			ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
			if(current){
				ctx.putImageData(current,0,0);//当前状态截图
			}
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			ctx.lineTo(ev.offsetX,ev.offsetY);
			ctx.stroke();
		}
		document.onmouseup=function(){
			canvas.onmouseup=null;
			canvas.onmousemove=null;
			current=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}
	}
*/

}])