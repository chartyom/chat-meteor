FlowRouter.route('/', {
    name: 'IndexPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'IndexLayout'
        });
    },
    triggersEnter: [ function(){
        console.log( "Index Page" );
        $('title').text('Index Page');
    }],
});

FlowRouter.route('/tasks', {
    name: 'TasksPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'TasksLayout'
        });
    },
    triggersEnter: [ function(){
        console.log( "Tasks Page" );
        $('title').text('Tasks Page');
    }],
});

FlowRouter.route('/users', {
    name: 'UsersPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'UsersLayout'
        });
    },
    triggersEnter: [ function(){
        console.log( "Users Page" );
        $('title').text('Users Page');
    }],
});

FlowRouter.route('/rooms', {
    name: 'RoomsPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'RoomsLayout'
        });
    },
    triggersEnter: [ function(){
        console.log( "Rooms Page" );
        $('title').text('Rooms Page');
    }],
});