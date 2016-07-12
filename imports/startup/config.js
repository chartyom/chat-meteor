const Options = {
    siteName: 'App',
    separatorSiteName: ' - '
};

export const Settings = {
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