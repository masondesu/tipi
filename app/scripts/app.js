//                      _____   _    ____   _                        
//       \/       \/   |_   _| | |  |  _ \ | |     \/       \/
//       /\       /\     | |   | |  |  __/ | |     /\       /\
//      /\ \     /\ \    | |   | |  | |    | |    /\ \     /\ \
//_____/_/\_\___/_/\_\___| |___| |__| |____| |___/_/\_\___/_/\_\______


///////////////////////////////////////////////////////////////////////
////////////////////// Create Ember Application ///////////////////////
///////////////////////////////////////////////////////////////////////

App = Ember.Application.create({
	// ready: function() {
 //    this.register('main:auth', App.AuthController);
 //    this.inject('route', 'auth', 'main:auth');
 //    this.inject('controller', 'auth', 'main:auth');
 //  }
});

// App Adapter 

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: new Firebase("https://sizzling-fire-4203.firebaseio.com")
  });

App.ApplicationSerializer = DS.FirebaseSerializer.extend();

//////////////////////// Date Formatting //////////////////////////////
Ember.Handlebars.registerBoundHelper('currentDate', function() {
  return moment().format('LL');
});

///////////////////////////////////////////////////////////////////////
//////////////////////// Routers //////////////////////////////////////
///////////////////////////////////////////////////////////////////////

App.Router.map(function(){
	this.resource('login');
	this.resource('app', function(){
		this.resource('dashboard');
		this.resource('new');
		this.resource('draft', {path: ':draft_id/review'});
		this.resource('proposal', {path: ':proposal_id/proposal'});
		this.resource('contract', {path: ':contract_id/contract'});	
		this.resource('brief', {path: ':brief_id/brief'});
	});

});

///////////////////////////////////////////////////////////////////////
////////////////////////// Routes /////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// Index redirect
App.IndexRoute = Ember.Route.extend({
	redirect: function() {
	    this.transitionTo('dashboard');
    }
});

App.AppRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.findAll("project");
    }
});

App.NewRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.findAll("project");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
App.DashboardRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find("user"); // I will need to pass an id here when I get user auth figured out
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////

App.DraftRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find("project", params.draft_id);
    }
});

App.ProposalRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find("project", params.proposal_id);
    }
});

App.ContractRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find("project", params.contract_id);
    }
});

App.BriefRoute = Ember.Route.extend({
    model: function(params) {
      return this.store.find("project", params.brief_id);
    }
});

///////////////////////////////////////////////////////////////////////
//////////////////// Models ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// Project
var attr = DS.attr;

// User
App.User = DS.Model.extend({
    userName: attr('string'),
	userAddress: attr('string'),
	userPhone: attr('number'),
	userEmail: attr('string'),
	hourlyRate: attr('number')
});

// I need to transfer user settings from user model to project

App.Project = DS.Model.extend({
	title: attr('string'),

	userName: attr('string'),
	userAddress: attr('string'),
	userPhone: attr('string'),
	userEmail: attr('string'),

	// "date" to be established when printed
	// I may remove it from the model and just show today's date in the browser
	date: attr('number'),
	clientName: attr('string'),
	clientTitle: attr('string'),
	clientCo: attr('string'),
	clientEmail: attr('string'),

	projectType: attr('string'),
	personal: DS.attr('boolean'),
	professional: DS.attr('boolean'),
	description: attr('string'),
	technology: attr('string'),

	delivery: attr('string'),
	examples: attr('string'),
	hasCopy: DS.attr('boolean'),
	hasArt: DS.attr('boolean'),

	startDate: attr('string'),
	completionDate: attr('string'),
	hourlyRate: attr('number'),
	estimatedHours: attr('number'),
	
	totalCost: attr('number'),
	deposit: attr('number'),
	submittedOn: attr('number'),
	savedOn: attr('number'),
	isCompleted: DS.attr('boolean')
})

///////////////////////////////////////////////////////////////////////
//////////////////// Controllers //////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// All Text Fields
Ember.TextField.reopen({
    classNames: ['all-text-inputs']
});

//////////////////////////// Dashboard Controller /////////////////////////////////
App.DashboardController = Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		edit: function(){
			this.set('isEditing', true);
		},

		doneEditing: function(){
			this.set('isEditing', false);

			// I need to describe update model here (user or project)	

		    project.save();
		}
	}
})

/////////////////////////// New Controller ////////////////////////////////////////
App.NewController = Ember.ObjectController.extend({
 
 actions :{
    save : function(){
    	var title = $('#title').val();

        var userName = $('#user-name').val();
        var userAddress = $('#user-address').val();
        var userPhone = $('#user-phone').val();
        var userEmail = $('#user-email').val();

        var clientName = $('#client-name').val();
        var clientTitle = $('#client-title').val();
        var clientCo = $('#client-co').val();
        var clientEmail = $('#client-email').val();

        var projectType = $('#project-type').val();
        var professional = this.get('isPro');
        var personal = this.get('isPersonal');
        var description = $('#description').val();
        var technology = $('#technology').val();

        var delivery = $('#delivery').val();
        var examples = $('#examples').val();
        var hasCopy = this.get('getCopy');
        var hasArt = this.get('getArt');

        var startDate = $('#start-date').val();
        var completionDate = $('#completion-date').val();
        var hourlyRate = $('#hourly-rate').val();
        var estimatedHours = $('#estimated-hours').val();
        
        var totalCosts = function(){
        	return hourlyRate * estimatedHours
        }
        var totalCost = totalCosts();
        var deposits = function(){
        	return totalCost / 5
        }
        var deposit = deposits();

        var submittedOn = new Date();

        var store = this.get('store');
        var project = this.store.createRecord('project',{
        	title : title,
			userName: userName,
			userAddress: userAddress,
			userPhone: userPhone,
			userEmail: userEmail,

			clientName: clientName,
			clientTitle: clientTitle,
			clientCo: clientCo,
			clientEmail: clientEmail,

			projectType: projectType,
			personal: personal,
			professional: professional,
			description: description,
			technology: technology,

			delivery: delivery,
			examples: examples,
			hasCopy: hasCopy,
			hasArt: hasArt,

			startDate: startDate,
			completionDate: completionDate,
			estimatedHours: estimatedHours,
			hourlyRate: hourlyRate,

			totalCost: totalCost,
			deposit: deposit,
            submittedOn : submittedOn
        });
        project.save();

        this.set('isPro', false);
        this.set('isPersonal', false);
        this.set('getCopy', false);
        this.set('getArt', false);

        this.transitionToRoute('dashboard');

    },
 }
});

/////////////////////////////////// mail to //////////////////////////////////
// equivalent to `if(App.computed === undefined) App.computed = {};`
App.computed = App.computed || {};
App.computed.mailto = function(property) {
  return function() {
    return "mailto:" + this.get(property);
  }.property(property);
};

/////////////////////////// Draft Controller ////////////////////////////////////
App.DraftController = Ember.ObjectController.extend({
	mailtoContactEmail: App.computed.mailto('clientEmail'),
	isEditing: false,

	init: function(){
		// Trying to get the model id and set it as a url extension for send usage
		// var draftId = this.get('model.id');
		// console.log('tipiapp.com/#/app/' + draftId);
	},

	actions: {
		edit: function(){
			this.set('isEditing', true);
		},

		doneEditing: function(){
			this.set('isEditing', false);

			var title = $('#title').val();

	        var userName = $('#user-name').val();
	        var userAddress = $('#user-address').val();
	        var userPhone = $('#user-phone').val();
	        var userEmail = $('#user-email').val();

	        var clientName = $('#client-name').val();
	        var clientTitle = $('#client-title').val();
	        var clientCo = $('#client-co').val();
	        var clientEmail = $('#client-email').val();

	        var projectType = $('#project-type').val();
	        var professional = this.get('isPro');
	        var personal = this.get('isPersonal');
	        var description = $('#description').val();
	        var technology = $('#technology').val();

	        var delivery = $('#delivery').val();
	        var examples = $('#examples').val();
	        var hasCopy = this.get('getCopy');
	        var hasArt = this.get('getArt');

	        var startDate = $('#start-date').val();
	        var completionDate = $('#completion-date').val();
	        var hourlyRate = $('#hourly-rate').val();
	        var estimatedHours = $('#estimated-hours').val();

	        var totalCosts = function(){
	        	return hourlyRate * estimatedHours
	        }
	        var totalCost = totalCosts();
	        var deposits = function(){
	        	return totalCost / 5
	        }
	        var deposit = deposits();

			var project = this.get('model',{
				title : title,

				userName: userName,
				userAddress: userAddress,
				userPhone: userPhone,
				userEmail: userEmail,

				clientName: clientName,
				clientTitle: clientTitle,
				clientCo: clientCo,
				clientEmail: clientEmail,

				projectType: projectType,
				personal: personal,
				professional: professional,
				description: description,
				technology: technology,

				delivery: delivery,
				examples: examples,
				hasCopy: hasCopy,
				hasArt: hasArt,

				startDate: startDate,
				completionDate: completionDate,
				estimatedHours: estimatedHours,
				hourlyRate: hourlyRate,

				totalCost: totalCost,
				deposit: deposit
			});
			project.set('savedOn', new Date());
			project.set('totalCost', totalCost);
			project.set('deposit', deposit);
		    project.save();
		},

		cancel: function(){
			this.set('isEditing', false);
		},

		setCopyAsFalse: function(){
			var project = this.get('model');
		    project.set('hasCopy', false);
		    project.save();
		},

		isCompleted: function(){
			var project = this.get('model');
		    project.set('isCompleted', true);
		    project.set('savedOn', new Date());
		    project.save();

		    id = project.get('id'); // trying to get the id to reuse for send link
		    this.transitionToRoute('dashboard');
		},

		removeProject: function() {
		    var project = this.get('model');
		    project.deleteRecord();
		    project.save();
		    this.transitionToRoute('dashboard');
		}
	}
})

///////////////////////// App Controller (logged in) /////////////////////////////
App.AppController = Ember.ArrayController.extend({
	itemController: 'project',

	actions:{

		showDrafts :function(){
			$('.draft-drop').toggleClass('show-drafts');
		},

		showQueue :function(){
 			$('.queue-drop').toggleClass('show-drafts');
 		},

 		closeNav :function(){
 			$('.nav').toggleClass('move-right');
 			$('.header-left').toggleClass('move-right');
 		}

	}
});

App.ProjectController = Ember.ObjectController.extend({
  isSelected: false,
  actions: {
  	showDocs: function(){
  		this.toggleProperty('isSelected');
  	}
  }
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Docs /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/////////////////////////////// Proposal Controller ///////////////////////////
App.ProposalController = Ember.ObjectController.extend({
	mailtoContactEmail: App.computed.mailto('clientEmail'),

	actions:{
		printContent :function(){
			var restorepage = document.body.innerHTML;
			var printcontent = document.getElementById('proposal-container').innerHTML;
			document.body.innerHTML = printcontent;
			window.print();
			document.body.innerHTML = restorepage;
		},

		isIncomplete: function(){
			var project = this.get('model');
		    project.set('isCompleted', false);
		    project.set('savedOn', new Date());
		    project.save();
		    this.transitionToRoute('dashboard');
		},

		removeProject: function() {
		    var project = this.get('model');
		    project.deleteRecord();
		    project.save();
		    this.transitionToRoute('dashboard');
		}
	}
});

///////////////////////// Contract Controller /////////////////////////////////////////
App.ContractController = Ember.ObjectController.extend({
	actions:{
		printContent :function(){
			var restorepage = document.body.innerHTML;
			var printcontent = document.getElementById('contract-container').innerHTML;
			document.body.innerHTML = printcontent;
			window.print();
			document.body.innerHTML = restorepage;
		},

		isIncomplete: function(){
			var project = this.get('model');
		    project.set('isCompleted', false);
		    project.set('savedOn', new Date());
		    project.save();
		    this.transitionToRoute('dashboard');
		},

		removeProject: function() {
		    var project = this.get('model');
		    project.deleteRecord();
		    project.save();
		    this.transitionToRoute('dashboard');
		}
	}
});

////////////////////////////// Brief Controller /////////////////////////////////////
App.BriefController = Ember.ObjectController.extend({
	actions:{
		printContent :function(){
			var restorepage = document.body.innerHTML;
			var printcontent = document.getElementById('brief-container').innerHTML;
			document.body.innerHTML = printcontent;
			window.print();
			document.body.innerHTML = restorepage;
		},

		isIncomplete: function(){
			var project = this.get('model');
		    project.set('isCompleted', false);
		    project.set('savedOn', new Date());
		    project.save();
		    this.transitionToRoute('dashboard');
		},

		removeProject: function() {
		    var project = this.get('model');
		    project.deleteRecord();
		    project.save();
		    this.transitionToRoute('dashboard');
		}
	}
});

/////////////////////////////////////////////////////////////////////////////
//////////////////////////////  Views  /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

App.AppView = Ember.View.extend({
	classNames: ['body-container'],
	templateName: 'app'
})

///////////////////////////////////////////////////////////////////////
//////////////////// User Authentication //////////////////////////////
///////////////////////////////////////////////////////////////////////


// var dbRoot = "https://sizzling-fire-4203.firebaseio.com"
// var dbRef = new Firebase(dbRoot);

// var ideasPath = dbRoot + "/ideas";
// var usersPath = dbRoot + "/users";


// // Login Controller
// App.LoginRoute = Ember.Route.extend({
//   actions: {
//     login: function() {
//       this.get('auth').login();
//     },

//     logout: function() {
//       this.get('auth').logout();
//     }
//   }
// });

// App.AuthController = Ember.Controller.extend({
//   authed: false,
//   currentUser: null,

//   init: function() {
//     this.authClient = new FirebaseSimpleLogin(dbRef, function(error, githubUser) {
//       if (error) {
//         alert('Authentication failed: ' + error);
//       } else if (githubUser) {
//         this.set('authed', true);
//         var userRef = new Firebase(usersPath + '/' + githubUser.username);
//         var controller = this;
//         var properties = {
//           id: githubUser.username,
//           name: githubUser.username,
//           displayName: githubUser.displayName,
//           avatarUrl: githubUser.avatar_url,
//         };
//         userRef.once('value', function(snapshot) {
//           if (!snapshot.val().votesLeft) {
//             properties.votesLeft = 10;
//           } else {
//             properties.votesLeft = snapshot.val().votesLeft;
//           }
//           var user = App.User.create({ ref: userRef });
//           user.setProperties(properties);
//           controller.set('currentUser', user);
//         });
//       } else {
//         this.set('authed', false);
//       }
//     }.bind(this));
//   },

//   login: function() {
//     this.authClient.login('github');
//   },

//   logout: function() {
//     this.authClient.logout();
//   }

// });





//   			   \\\\      ////         ||||||||||||||||||||||||  ||||   ||||||||||||||\\\\    ||||
//   				\\\\    ////          ||||||||||||||||||||||||  ||||   |||||||||||||||\\\\   ||||
//  				 \\\\  ////                     ||||			||||   ||||		       \\\\  ||||
//   				  \\\\//// 				 	    ||||			||||   ||||			   ////  ||||
//           		   \\\///				 	    ||||			||||   |||||||||||||||////   ||||
//					    ))((					    ||||			||||   ||||||||||||||////    ||||
//					   ///\\\					    ||||			||||   ||||					 ||||
//        			  ////\\\\						||||			||||   ||||					 ||||
//         			 /////\\\\\						||||			||||   ||||					 ||||
//   				//////\\\\\\					||||			||||   ||||					 ||||
//   			   ////\//\\\\\\\					||||			||||   ||||					 ||||
// 				  ////  \/\\\\\\\\					||||			||||   ||||					 ||||
// 				 ////\   \\\\\\\\\\					||||			||||   ||||					 ||||
//     			//////\   \\\\\\\\\\				||||			||||   ||||					 ||||
//			   ////////\   \\\\\\\\\\				||||			||||   ||||					 ||||
// 			  //////////    \\\\\\\\\\				||||			||||   ||||					 ||||
// 			 //////////      \\\\\\\\\\				||||			||||   ||||					 ||||
// 		    //////////        \\\\\\\\\\			||||			||||   ||||					 ||||
//		   //////////          \\\\\\\\\\			||||			||||   ||||					 ||||
//        //////////            \\\\\\\\\\			||||			||||   |||| 				 ||||