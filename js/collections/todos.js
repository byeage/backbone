var app=app ||{};

// 模型集合
//使用本地存储代替数据库存储
var TodoList=Backbone.Collection.extend({
	model:app.Todo, //数据模型
	//保存集合的数据在todos-backbone作用域范围内
	localStorage:new Backbone.LocalStorage('todos-backbone'),
	//过滤所有完成过的事件
	completed:function(){
		return this.filter(function(todo){
			return todo.get('completed');
		});
	},
	//过滤未完成的数据
	remaining:function(){
		return this.without.apply(this,this.completed());
	},
	//保存事件序列号
	nextOrder:function(){
		if(!this.length){
			return 1;
		}else{
			return this.last().get('order')+1;
		}
	},
	//获取序列号
	comparator:function(todo){
		return todo.get('order');
	}

});


app.Todos=new TodoList();