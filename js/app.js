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

App.Product = DS.Model.extend({
    title: DS.attr('string'),
    price: DS.attr('number'),
    description: DS.attr('string'),
    isOnSale: DS.attr('boolean'),
    image: DS.attr('string')
});

App.Product.FIXTURES = [
    {
        id: 1,
        title: 'Flint',
        price: 99,
        description: 'Flint is..',
        isOnSale: true,
        image: 'images/flint.png'
    },
    {
        id: 2,
        title: 'Kindling',
        price: 33,
        description: 'Kindling Easily ...',
        isOnSale: false,
        image: 'images/kindling.png'
    }
];

App.Store = DS.Store.extend({

    adapter: DS.FixtureAdapter.extend()

});


App.Router.map(function() {

    this.route('about', { path: '/aboutus' } );

    this.resource('products', function () {
        this.resource('product', { path: '/:product_id' });
    });

    this.resource('contacts');
    this.resource('contact', { path: '/contacts/:name' });

});



App.IndexController = Ember.Controller.extend( {

    productsCount: 6,
    logo: 'images/logo.png',
    time: function() {
        return (new Date()).toDateString()
    }.property()

});

App.AboutController = Ember.Controller.extend({
    contactName: 'Zed'
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