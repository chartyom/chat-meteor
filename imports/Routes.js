import {Page} from '/imports/lib/PageEditor.js';
FlowRouter.route('/', {
    name: 'IndexPage',
    action(params, queryParams) {
        Page.setTitle("Главная страница");
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderNavbarMainThemeLayout',
            main: 'IndexLayout'
        });
    },
});

FlowRouter.route('/tasks', {
    name: 'TasksPage',
    action(params, queryParams) {
        Page.setTitle("Задачи");
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderNavbarMainThemeLayout',
            main: 'TasksLayout'
        });
    },
});

FlowRouter.route('/users', {
    name: 'UsersPage',
    action(params, queryParams) {
        Page.setTitle("Пользователи");
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderNavbarMainThemeLayout',
            main: 'UsersLayout'
        });
    },
});

FlowRouter.route('/dialogs', {
    name: 'DialogsPage',
    action(params, queryParams) {
        Page.setTitle("Мои Сообщения");
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderNavbarMainThemeLayout',
            main: 'DialogsLayout'
        });
    },
});

FlowRouter.route('/dialogs/:dialogId', {
    name: 'DialogsMessagesPage',
    action(params, queryParams) {
        Page.setTitle("Мои Сообщения");
        BlazeLayout.render( 'applicationLayout', {
            header: 'HeaderNavbarMainThemeLayout',
            main: 'DialogsMessagesLayout'
        });
    },
});
