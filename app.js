(function() {
            var on = true;

    return {
        events: {
            // APP Events
            "app.activated": function(data){
            if(data.firstLoad){

            this.popover();
            }
            this.requestTickets();
            },
            // AJAX Events
            "getView.done": "arrayifynames",
            ".click .dismiss": "dismiss",
            "goback": _.debounce(function() {
                if (on === true)
                this.requestTickets();
            }, 60000), 
            // DOM Events
            "click .alerttoggle": "togglealerts"
        },
        requests: {
        getView: function (){
            var view = this.setting('view_id');
            return {
            url: '/api/v2/views/' + view + '/tickets.json?include=users',
            type: 'GET'
            };
        }
    },
    togglealerts: function(){
        on = !on;
        this.$('.alerttoggle').toggleClass('on');
        if (on === false){
        this.changeicons("off");    
        this.switchTo('off');
        }
        if (on === true){
        this.switchTo('spinner');
        this.requestTickets();
        }


    },
    requestTickets: function(){
        var currentuser = this.currentUser();
        var name = currentuser.name();
        var nameArr = name.split(" ");
        this.store({name: nameArr[0]});
        var role = currentuser.role();
        if (role == 533295 || on === false) {
            return false;
        }
        this.ajax('getView');
    },
    arrayifynames: function(data){
        this.store({tickets: data});
        var names = {};
        for (var i = 0; i < data.users.length; i++){
            names[data.users[i].id] = data.users[i].name;
        }
            this.iteratetickets(names);
    },
    iteratetickets: function(name){
        var names = name;
        var tickets = {"tickets":[]};
        var data = this.store('tickets');
        var length = data.tickets.length;
        for (var i = 0; i < data.count; i++){
            var temp = {
                id: data.tickets[i].id,
                description: data.tickets[i].description,
                status: data.tickets[i].status,
                url: "/agent/#/tickets/" + data.tickets[i].id,
                subject: data.tickets[i].subject,
                name: names[data.tickets[i].requester_id]
            };
            tickets.tickets.push(temp);
        }

        this.displaynotifications(tickets, length, data);
    },
    displaynotifications: function(tickets, length){
        var audiocheck = this.$('audio').length;
        this.switchTo('list', tickets);
        this.changeicons("on", length);
        var listedtickets = this.store('listedtickets');
        if (listedtickets == null){
            this.store({listedtickets: tickets});
            listedtickets = this.store('listedtickets');
        }
        var newtickets = _.pluck(tickets.tickets, 'id');
        var listed = _.pluck(listedtickets.tickets, 'id');
        var newticket = _.difference(newtickets, listed);
        var count = newticket.length;
        if (count > 0){
         this.popover();
            if (audiocheck > 0){
                this.$('.alertsound').get(0).play();}
            
        }
        this.store({listedtickets: tickets});
        this.trigger('goback');
        },
    changeicons: function(tog, length){
        if (tog == "on" && length > 0){
        this.setIconState('active', this.assetURL('Ticket-Tally_' + length + '.png'));
        this.setIconState('inactive', this.assetURL('Ticket-Tally_' + length + '.png'));
        this.setIconState('hover', this.assetURL('Ticket-Tally_' + length + '.png'));
    }
    else {
        this.setIconState('active', this.assetURL('icon_top_bar_inactive.png'));
        this.setIconState('inactive', this.assetURL('icon_top_bar_inactive.png'));
        this.setIconState('hover', this.assetURL('icon_top_bar_inactive.png'));
        }
    }
    };
})();