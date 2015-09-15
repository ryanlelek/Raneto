module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            html: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/scripts/raneto.js', 'models/*.js', 'service/*.js', 'tools/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            uglify: {
                files: ['public/scripts/raneto.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/scripts/jquery.form.js']
            },
            all: ['public/scripts/*.js', 'server/**/*.js', 'bin/*.js', 'routers/*.js', 'models/*.js', 'tools/*.js']
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/scripts/*.js'],
                dest: 'public/build/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'public/build/index.min.js': 'public/scripts/index.js',
                    'public/build/all<%= Date.now() %>.min.js': [
                        'public/scripts/*.js'
                    ]
                }
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'app',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        concurrent: {
            tasks: ['nodemon', 'watch', 'uglify', 'jshint'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.option('force', true);

    grunt.registerTask('default', ['concurrent']);
};
