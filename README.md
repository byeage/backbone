###模型 模型包含一个程序的数据和逻辑
	exp:
    var Todo = Backbone.Model.extend({
        initialize:function(){ //构造函数
			this.on("change",function(){
            	//监听模型的改变
            })

        },
        defaults:{ //默认值
                        title:"",
                        completed:false
        }
    });
    
    var todo=new Todo(),
    title=todo.get('title')
    	
    
###Model.get()
