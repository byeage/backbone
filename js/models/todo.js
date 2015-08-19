var app=app || {};

// 模型属性 title,order,completed
	app.Todo=Backbone.Model.extend({
		//默认属性
		defaults:{
			title:'',
			completed:false
		},
		//切换状态，保存模型的completed属性
		toggle:function(){  //toggle completed state
			this.save({
				completed:!this.get('completed')
			});
		}
	});