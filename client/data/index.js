export default {
    'content': {
        'twitter_url': 'https://twitter.com/camper',
        'facebook_url': 'https://www.facebook.com/Camper',
        'instagram_url': 'https://instagram.com/camper/',
        'lab_url': 'http://www.camper.com/lab',
        'men_shop_url': 'http://www.camper.com/int/men/shoes/ss16_inspiration',
        'women_shop_url': 'http://www.camper.com/int/women/shoes/ss16_inspiration',
    },

    'default-route': '/home',

    'routing': {
        '/home': {
            'slideshows': [
                {
                    images: [
                        { url: 'a/0.jpg' },
                        { url: 'a/1.jpg' }
                    ]
                },
                {
                    images: [
                        { url: 'a/1.jpg' },
                        { url: 'a/0.jpg' }
                    ]
                },
                {
                    images: [
                        { url: 'a/0.jpg' },
                        { url: 'a/1.jpg' }
                    ]
                }
            ]
        }
    }
}
