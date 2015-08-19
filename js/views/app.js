// js/views/app.js
var app = app || {};
// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
app.AppView = Backbone.View.extend({
		//绑定到一个已存在的元素上
    el: '#todoapp',
    //状态模板
    statsTemplate: _.template($('#stats-template').html()),
    // New
    //为添加的元素添加事件委托
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },
    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    //在初始化的时候为模型集合绑定相关的事件，当事件增加或者改变时，保存到本地存储
    initialize: function() {
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');
        //监听集合事件
        this.listenTo(app.Todos, 'add', this.addOne);//监听模型add事件
        this.listenTo(app.Todos, 'reset', this.addAll);//监听模型reset事件
        // New
        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);
        app.Todos.fetch();
    },
    // New
    // Rerendering the app just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;
        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();
            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));
            this.$('#filters li a').removeClass('selected').filter('[href="#/' + (app.TodoFilter || '') + '"]').addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckbox.checked = !remaining;
    },
  	//处理单条事件
    addOne: function(todo) {
        var view = new app.TodoView({
            model: todo
        });
        $('#todo-list').append(view.render().el);
    },
    //添加事件集合
    addAll: function() {
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },
    // 过滤单个事件集合
    filterOne: function(todo) {
        todo.trigger('visible');
    },
    //过滤事件集合
    filterAll: function() {
        app.Todos.each(this.filterOne, this);
    },
    // New
    // 为单个事件生成属性
    newAttributes: function() {
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },
    // New
    //创建一个新的事件模型，保存到本地存储
    createOnEnter: function(event){
        if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
            return;
        }
        app.Todos.create(this.newAttributes());
        this.$input.val('');
    },
    // New
    // Clear all completed todo items, destroying their models.
    //清除所有完成的事件项，清除它的模型
    clearCompleted: function() {
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },
    // 所有时间事件切换状态
    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;
        app.Todos.each(function(todo) {
            todo.save({
                'completed': completed
            });
        });
    }
});