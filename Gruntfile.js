/*
 * Gruntfile.js
 * @author Todd Motto
 * @version 1.0.0
 */

'use strict';

var LIVERELOAD_PORT = 35729;

var lrSnippet = require( 'connect-livereload' )({
    port: LIVERELOAD_PORT
});

var mountFolder = function ( connect, dir ) {
    return connect.static( require( 'path' ).resolve( dir ) );
};

module.exports = function ( grunt ) {


    pkg: grunt.file.readJSON('package.json'),
    require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    grunt.initConfig({
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function ( connect ) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }
        },
        tag: {
            banner: "/*!\n" +
                    " * Dev Tools workflow\n" +
                    " * @author Todd Motto\n" +
                    " * @version 1.0.0\n" +
                    " * Copyright 2013.\n" +
                    " */\n"
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/scripts.min.js': [ 'src/js/scripts.js' ]
                }
            },
            options: {
                banner: "<%= tag.banner %>"
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/css/style.min.css': 'src/scss/style.scss'
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        watch: {
            uglify: {
                files: 'src/js/{,*/}*.js',
                tasks: ['uglify']
            },
            sass: {
                files: 'src/scss/{,*/}*.{scss,sass}',
                tasks: ['sass']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'dist/index.html',
                    'dist/css/*.css',
                    'dist/js/{,*/}*.js',
                    'dist/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });

    grunt.registerTask( 'default' , [
        'sass',
        'uglify',
        'connect:livereload',
        'open',
        'watch'
    ]);

};