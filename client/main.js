import '../imports/startup/accounts-config.js';
import '../imports/layouts/Layouts.js';

import '../imports/widgets/tasks/WidgetTasks.js';
import '../imports/widgets/users/WidgetUsers.js';
import '../imports/widgets/sendMessageModal/WidgetSendMessageModal.js';
import '../imports/widgets/dialogsMessages/WidgetDialogsMessages.js';
import '../imports/widgets/dialogsMessages/WidgetDialogs.js';

import '../imports/routes.js';
import {Settings} from '../imports/startup/config.js';

Template.body.onCreated(function(){
    Settings.setTitle();
});