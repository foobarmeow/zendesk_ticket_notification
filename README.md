## Ticket Notification App

Add a pane in your Zendesk that notifies you of new tickets in a given view. This app is best used for low volume views (less than 20 active tickets at a time).

### What does this app do?

The ticket notification app will add an app in the top bar location inside your zendesk. When installing the app, you will specify a ticket view that you have already created in your Zendesk. This app will then alert you to any new tickets in that view, and will list the new tickets in that view, the status of the ticket, as well as the ticket requester. 

The app displays a badge that shows the count of new tickets (up to 20) where the app button show in the top bar location. It also plays a sound when a new ticket comes into this view. 

### Customization.

When installing the app, you are asked to provide the ID of the view you want to use this app for. You can find the ID of the view by going to https://yourzendesksubdomain.com/api/v2/views.json. 

You will also be asked to provide a display name for the app. This name will display within the app pane itself. 

If you want to change the sound that plays when a new ticket arrives, you can delete 'alertsound.ogg' in the assets directory, and replace it with your own file. Then, rename your file to 'alertsound'. If you'd like to use a different format than ogg, you must go into the layout.hdbs template, and change the filename there, as the audio element that allows the sound to play is in that part of the app. 

### Disclaimer. 

I take no responsibility if this app in any way harms your Zendesk (though I have no reason to believe it should). It may or may not violate your terms of service with Zendesk, so I would check with that just to be sure. 

## Important!
The app pulls the view you designate every ten seconds. This app should only be used for LOW VOLUME VIEWS. It could affect the performance of your Zendesk if you modify it to request the view any more frequently than that. The API limits requests to 200 per minute. So take the number of request you would make per minute, divide 200 by that number, and that is how many agents can use this app before potentially affecting the performance of your Zendesk.  

Please post if you come up with any issues! I would love to get some feedback on this. 