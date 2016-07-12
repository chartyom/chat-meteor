FlowRouter.route('/', {
    name: 'IndexPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'IndexLayout'
        });
    },
});

FlowRouter.route('/tasks', {
    name: 'TasksPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'TasksLayout'
        });
    },
});

FlowRouter.route('/users', {
    name: 'UsersPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'UsersLayout'
        });
    },
});

FlowRouter.route('/dialogs', {
    name: 'DialogsPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'DialogsLayout'
        });
    },
});

FlowRouter.route('/dialogs/:dialogId', {
    name: 'DialogsMessagesPage',
    action(params, queryParams) {
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderLayout',
            main: 'DialogsMessagesLayout'
        });
    },
});
