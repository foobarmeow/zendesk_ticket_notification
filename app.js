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
            "getView.done": "requestNames",
            "getNames.done": "arrayifynames",
            "goback": _.debounce(function() {
                if (on === true)
                this.requestTickets();
            }, 60000), 
            // DOM Events
            "click .alerttoggle": "togglealerts"
        },
        requests: {
        getNames: function(requesters){
            return{
                url: '/api/v2/users/show_many.json?ids=' + requesters
            };
        },
        getView: function (){
            var view = this.setting('view_id');
            return {
            url: '/api/v2/views/' + view + '/tickets.json',
            type: 'GET'
            };
        }
    },
    names: function(requesters){
        this.ajax('getNames', requesters);
    },
    togglealerts: function(){
        on = this.store('togglealerts');
        this.$('.alerttoggle').toggleClass('on');
        if (on === null){
            on = true;
        }
        on = !on;
        if (on === false){
        this.changeicons("off");    
        this.switchTo('off');
        }
        if (on === true){
        this.switchTo('spinner');}
        this.store({togglealerts: on});
        this.trigger('goback');
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
    requestNames: function(data){
        var requestersjson = [];
        for (var i = 0; i < data.count; i++){
            requestersjson.push(data.tickets[i].requester_id);
        }
        this.store({tickets: data});
        var requesters = requestersjson.join();
        this.ajax('getNames', requesters);
    },
    arrayifynames: function(data){
        var names = {};
        for (var i = 0; i < data.count; i++){
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