module.exports = function (grunt) {
  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  var banner = [
    '/*!',
    ' * <%= pkg.name %> <%= pkg.version %>',
    ' * <%= pkg.homepage %>',
    ' * Copyright (c) 2015  tianyingchun@outlook.com',
    ' * <%= pkg.description %>',
    ' * built on: ' + new Date(),
    ' */',
    ''
  ].join("\n");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: banner,

    webfont: {
      glyphicons: {
        src: './webfonts/vectors/*.svg',
        dest: './public/fonts/',
        destCss: './core/',
        options: {
          font: 'glyphicons',
          fontFilename: 'glyphicons',
          types: 'eot,woff,ttf,svg',
          syntax: 'bem',
          template: './webfonts/templates/bem.css',
          htmlDemo: true,
          htmlDemoTemplate: './webfonts/templates/demo.html',
          destHtml: './public/',
          stylesheet: 'less',
          // cause of the glyphicons.less will copy to ./core/ so, the replace path is
          // ../public/fonts
          relativeFontPath: '../public/fonts',
          templateOptions: {
            baseClass: 'glyph-icon',
            classPrefix: 'glyph-',
            mixinPrefix: 'glyph-'
          }
        }
      }
    },
    less: {
      options: {
        paths: ["./core"],
        banner: '<%= banner%>',
        relativeUrls: true
      },
      dev: {
        files: {
          "./public/themes/glodon-yun/common.css": "./core/themes/glodon-yun/customui.less",
          "./public/common.css": "./core/bootstrap.basic.less"
        }
      },
      prod: {
        options: {
          sourceMap: false,
          plugins: [
            new(require('less-plugin-autoprefix'))({
              browsers: ['ie >= 8',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.0'
              ]
            }),
            new(require('less-plugin-clean-css'))({
              advanced: true,
              compatibility: 'ie8'
            })
          ],
          modifyVars: {
            imageCDN: '"http://mycdn.com/path/to/images"',
            bgColor: 'red'
          }
        },
        files: {
          "./public/themes/glodon-yun/common.min.css": "./core/themes/glodon-yun/customui.less",
          "./public/common.min.css": "./core/bootstrap.basic.less"
        }
      }
    },
    nodemon: {
      dev: {
        script: './bin/www',
        options: {
          nodeArgs: [/*'--debug'*/],
          env: {
            // require the process.env.NODE_ENV =='development' | 'production'
            NODE_ENV: 'development',
            // enable logging: DEBUG: app:*, expressjs, node,..
            DEBUG: 'app:*',
            PORT: '20000',
            DEBUG_COLORS: true
          },
          ext: 'js,jsx,html,ejs'
        }
      },
      prod: {
        script: './bin/www',
        options: {
          env: {
            NODE_ENV: 'production',
            PORT: '20000'
          }
        }
      }
    },
    watch: {
      webfonts: {
        files: './webfonts/**/*',
        tasks: ['webfont'],
        options: {
          interrupt: true
        }
      },
      styles: {
        files: './less/**/*',
        tasks: ['less'],
        options: {
          interrupt: true
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      prod: {
        tasks: ['nodemon:prod', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('prod', ['concurrent:prod']);
};
