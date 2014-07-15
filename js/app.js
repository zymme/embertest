/**
 * Created by zimmerd on 7/10/14.
 */

var App =  Ember.Application.create( {
    LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.ProductsRoute = Ember.Route.extend({

    model: function () {
//       return App.PRODUCTS;
//        debugger;
        return this.store.find('product');
    }
});

App.IndexRoute = Ember.Route.extend({

    model: function() {

        return this.store.find('product');

    }
});

App.Product = DS.Model.extend({
    title: DS.attr('string'),
    price: DS.attr('number'),
    description: DS.attr('string'),
    isOnSale: DS.attr('boolean'),
    image: DS.attr('string'),
    reviews: DS.hasMany('review', { async: true } )
});

App.Review = DS.Model.extend( {

    text: DS.attr('string'),
    reviewedAt: DS.attr('date'),
    product: DS.belongsTo('product')
});

App.Review.FIXTURES = [
    {
        id: 100,
        text: "Started on fire!@!"
    },
    {
        id: 101,
        text: "Not the biggest flame but warm :)"
    }

];

App.Product.FIXTURES = [
    {
        id: 1,
        title: 'Flint',
        price: 99,
        description: 'Flint is..',
        isOnSale: true,
        image: 'images/flint.png',
        reviews: [100, 101]
    },
    {
        id: 2,
        title: 'Kindling',
        price: 33,
        description: 'Kindling Easily ...',
        isOnSale: false,
        image: 'images/kindling.png'
    } ,
    {
        id: 3,
        title: 'Matches',
        price: 4,
        description: 'Matches!!! they are awesome',
        isOnSale: false,
        image: ''
    },
    {
        id: 4,
        title: 'Fire Pit',
        price: 69,
        description: 'Fire pits are great for outdoor fun!',
        isOnSale: true,
        image: ''
    }
];

App.Store = DS.Store.extend({

    adapter: DS.FixtureAdapter.extend()

});


App.Router.map(function() {

    this.route('about', { path: '/aboutus' } );

    this.resource('products', function () {
        this.resource('product', { path: '/:product_id' });
        this.route('onsale');
    });

    this.resource('contacts');
    this.resource('contact', { path: '/contacts/:name' });

});



App.IndexController = Ember.ArrayController.extend( {

    productsCount: Ember.computed.alias('length'),
    onSale: function() {
//        debugger;
        return this.filter(function(product) {
//            debugger;
            return product.get('isOnSale');
        });
    }.property('@each.isOnSale'),
    logo: 'images/logo.png',
    time: function() {
        return (new Date()).toDateString()
    }.property()

});



App.ProductsController = Ember.ArrayController.extend( {

    sortProperties: ['title'],
    sortAscending: true
});

App.AboutController = Ember.Controller.extend({
    contactName: 'Zed'
});


App.ProductsOnsaleRoute = Ember.Route.extend({

   model: function(){
       return this.modelFor('products').filterBy('isOnSale');
   }
});


//App.ProductRoute = Ember.Route.extend({
//
//    model: function(params) {
//        console.log(params);
////        return App.PRODUCTS.findBy('title', params.title);
//        return this.store.find('product', params.product_id);
//    }
//});

App.ContactRoute = Ember.Route.extend({
    model: function(params) {
        return App.CONTACTS.findBy('name', params.name);
    }
});