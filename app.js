var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
	marked = require('marked'),
    moment = require('moment'),
    raneto = require('./raneto'),
    config = require('./config'),
    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

app.use(favicon(__dirname +'/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next){
    if(req.query.search){
        var searchResults = raneto.search(req.query.search);
        searchResults.forEach(function(result){
            searchResults.push(raneto.getPage(__dirname +'/content/'+ result.ref, config));
        });

        var pageListSearch = raneto.getPages('');
        return res.render('search', {
            config: config,
            pages: pageListSearch,
            search: req.query.search,
            searchResults: searchResults,
            body_class: 'page-search'
        });
    }
	else if(req.params[0]){
        var slug = req.params[0];
        if(slug == '/') slug = '/index';

        var filePath = __dirname +'/content'+ slug +'.md',
            pageList = raneto.getPages(slug);

        if(slug == '/index' && !fs.existsSync(filePath)){
            return res.render('home', {
                config: config,
                pages: pageList,
                body_class: 'page-home'
            });
        } else {
            fs.readFile(filePath, 'utf8', function(err, content) {
                if(err){
                    res.status(404);
                    return res.render('error', {
                        message: 'Not Found',
                        error: {}
                    });
                }

                // File info
                var stat = fs.lstatSync(filePath);
                // Meta
                var meta = raneto.processMeta(content);
                content = raneto.stripMeta(content);
                // Content
                content = raneto.processVars(content, config);
                var html = marked(content);

                return res.render('page', {
                    config: config,
                    pages: pageList,
                    meta: meta,
                    content: html,
                    body_class: 'page-'+ raneto.cleanString(slug.replace(/\//g, ' ')),
                    last_modified: moment(stat.mtime).format('Do MMM YYYY')
                });
            });
        }
	} else {
		next();
	}
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
