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

        var pageListSearch = raneto.getPages('', config);
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
            pageList = raneto.getPages(slug, config);

        if(slug == '/index' && !fs.existsSync(filePath)){
            return res.render('home', {
                config: config,
                pages: pageList,
                body_class: 'page-home'
            });
        } else {
            fs.readFile(filePath, 'utf8', function(err, content) {
                if(err){
                    err.status = '404';
                    err.message = 'Whoops. Looks like this page doesn\'t exist.';
                    return next(err);
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

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            config: config,
            status: err.status,
            message: err.message,
            error: err,
            body_class: 'page-error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        config: config,
        status: err.status,
        message: err.message,
        error: {},
        body_class: 'page-error'
    });
});


module.exports = app;
