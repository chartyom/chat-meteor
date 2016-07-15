import {Options} from '/imports/Config.js'

export const Page = {
    setTitle: function(title){
        document.title = (title !== undefined) ? Options.siteName +
        Options.separatorSiteName +
        title : Options.siteName;
    },
    setNewTitle: function(title){
        document.title = title;
    },
    getTitle: function(){
        return document.title;
    },
};
