/**
 * Created by zimmerd on 7/15/14.
 */
var App = Ember.Application.create({
    LOG_TRANSITIONS: true
});
App.Router.map(function() {
    this.route('credits', { path: '/thanks' });
    this.resource('products', function() {
        this.resource('product', { path: '/:product_id' });
        this.route('onsale');
        this.route('deals');
    });
    this.resource('contacts', function() {
        this.resource('contact', { path: '/:contact_id' });
    });
});

App.IndexController = Ember.ArrayController.extend({
    productsCount: Ember.computed.alias('length'),
    logo: 'images/logo-small.png',
    time: function() {
        return (new Date()).toDateString();
    }.property(),
    onSale: function() {
        return this.filterBy('isOnSale').slice(0,3);
    }.property('@each.isOnSale')
});
App.ContactsIndexController = Ember.Controller.extend({
    contactName: 'Anostagia',
    avatar: 'images/avatar.png',
    open: function() {
        return ((new Date()).getDay() === 0) ? "Closed" : "Open";
    }.property()
});
App.ProductsController = Ember.ArrayController.extend({
    sortProperties: ['title']
});
App.ContactsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    contactsCount: Ember.computed.alias('length')
});
App.ReviewsController = Ember.ArrayController.extend({
    sortProperties: ['reviewedAt'],
    sortAscending: false
});
App.ContactProductsController = Ember.ArrayController.extend({
    sortProperties: ['title']
});
App.ProductController = Ember.ObjectController.extend({
    text: '',
    actions: {
        createReview: function(){
            var review = this.store.createRecord('review', {
                text: this.get('text'),
                product: this.get('model'),
                reviewedAt: new Date()
            });
            var controller = this;
            review.save().then(function() {
                controller.set('text', '');
                controller.get('model.reviews').addObject(review);
            });
        },
        createRating: function() {
            var product = this.get('model');
            var selectedRating = this.get('selectedRating');
            product.get('ratings').addObject(selectedRating);
            product.save();
        }
    },
    ratings: [1,2,3,4,5],
    selectedRating: 5
});

App.ProductsRoute = Ember.Route.extend({
    model: function() {
        return this.store.findAll('product');
    }
});
App.ContactsRoute = Ember.Route.extend({
    model: function() {
        return this.store.findAll('contact');
    }
});
App.IndexRoute = Ember.Route.extend({
    model: function(){
        return this.store.findAll('product');
    }
});
App.ProductsIndexRoute = Ember.Route.extend({
    model: function(){
        return this.store.findAll('product');
    }
});
App.ProductsOnsaleRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('products').filterBy('isOnSale');
    }
});
App.ProductsDealsRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('products').filter(function(product){
            return product.get('price') < 500;
        });
    }
});

App.ProductDetailsComponent = Ember.Component.extend({
    reviewsCount: Ember.computed.alias('product.reviews.length'),
    hasReviews: function(){
        return this.get('reviewsCount') > 0;
    }.property('reviewsCount')
});
App.ContactDetailsComponent = Ember.Component.extend({
    productsCount: Ember.computed.alias('contact.products.length'),
    isProductive: function() {
        return this.get('productsCount') > 3;
    }.property('productsCount')
});

App.ProductView = Ember.View.extend({
    isOnSale: Ember.computed.alias('controller.isOnSale'),
    classNameBindings: ['isOnSale']
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.Product = DS.Model.extend({
    title: DS.attr('string'),
    price: DS.attr('number'),
    description: DS.attr('string'),
    isOnSale: DS.attr('boolean'),
    image: DS.attr('string'),
    reviews: DS.hasMany('review', { async: true }),
    crafter: DS.belongsTo('contact', { async: true }),
    ratings: DS.attr(),
    rating: function(){
        return this.get('ratings').reduce(function(previousValue, rating) {
            return previousValue + rating;
        }, 0) / this.get('ratings').length;
    }.property('ratings.@each')
});

App.Product.FIXTURES = [
    {  id: 1,
        title: 'Flint',
        price: 99,
        description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
        isOnSale: true,
        image: 'images/products/flint.png',
        reviews: [100,101],
        crafter: 200,
        ratings: [2,1,3,3]
    },
    {
        id: 2,
        title: 'Kindling',
        price: 249,
        description: 'Easily combustible small sticks or twigs used for starting a fire.',
        isOnSale: false,
        image: 'images/products/kindling.png',
        reviews: [],
        crafter: 201,
        ratings: [2,1,3,3]
    },
    {
        id: 3,
        title: 'Matches',
        price: 499,
        description: 'One end is coated with a material that can be ignited by frictional heat generated by striking the match against a suitable surface.',
        isOnSale: true,
        reviews: [],
        image: 'images/products/matches.png',
        crafter: 201,
        ratings: [2,1,3,3]
    },
    {
        id: 4,
        title: 'Bow Drill',
        price: 999,
        description: 'The bow drill is an ancient tool. While it was usually used to make fire, it was also used for primitive woodworking and dentistry.',
        isOnSale: false,
        reviews: [],
        image: 'images/products/bow-drill.png',
        crafter: 200,
        ratings: [1,3,3]
    },
    {
        id: 5,
        title: 'Tinder',
        price: 499,
        description: 'Tinder is easily combustible material used to ignite fires by rudimentary methods.',
        isOnSale: true,
        reviews: [],
        image: 'images/products/tinder.png',
        crafter: 201,
        ratings: [2,1,3]
    },
    {
        id: 6,
        title: 'Birch Bark Shaving',
        price: 999,
        description: 'Fresh and easily combustable',
        isOnSale: true,
        reviews: [],
        image: 'images/products/birch.png',
        crafter: 201,
        ratings: [2,3,5]
    }
];

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    about: DS.attr('string'),
    avatar: DS.attr('string'),
    products: DS.hasMany('product', { async: true })
});
App.Contact.FIXTURES = [
    {
        id: 200,
        name: 'Giamia',
        about: 'Although Giamia came from a humble spark of lightning, he quickly grew to be a great craftsman, providing all the warming instruments needed by those close to him.',
        avatar: 'images/contacts/giamia.png',
        products: [1,4]
    },
    {
        id: 201,
        name: 'Anostagia',
        about: 'Knowing there was a need for it, Anostagia drew on her experience and spearheaded the Flint & Flame storefront. In addition to coding the site, she also creates a few products available in the store.',
        avatar: 'images/contacts/anostagia.png',
        products: [2,3,5,6]
    }
];

App.Review = DS.Model.extend({
    text: DS.attr('string'),
    reviewedAt: DS.attr('date'),
    product: DS.belongsTo('product')
});
App.Review.FIXTURES = [
    {
        id: 100,
        text: "Started a fire in no time!"
    },
    {
        id: 101,
        text: "Not the brightest flame, but warm!"
    }
];
