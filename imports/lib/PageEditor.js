import {Options} from '/imports/startup/Config.js'

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
    scrollToElement: function(obj,callback){

        if (obj.length != 0){
            $(window).scrollTop((obj).offset().top);
        }

        if (callback && typeof(callback) === "function") {
            callback();
        }
    }
};
