var path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	moment = require('moment'),
	marked = require('marked'),
	lunr = require('lunr'),
	validator = require('validator'),
	config = require('./config');

var raneto = {

	metaRegex: /^\/\*([\s\S]*?)\*\//i,

	cleanString: function(str, underscore){
		var u = underscore || false;
		if(u){
			return _s.underscored(str);
		} else {
			return _s.dasherize(str);
		}
	},

	processMeta: function(markdownContent) {
		var metaArr = markdownContent.match(raneto.metaRegex),
			meta = {};

		var metaString = metaArr ? metaArr[1].trim() : '';
		if(metaString){
			var metas = metaString.match(/(.*): (.*)/ig);
			metas.forEach(function(item){
				var parts = item.split(': ');
				if(parts[0] && parts[1]){
					meta[raneto.cleanString(parts[0].trim(), true)] = parts[1].trim();
				}
			});
		}

		return meta;
	},

	stripMeta: function(markdownContent) {
		return markdownContent.replace(raneto.metaRegex, '').trim();
	},

	processVars: function(markdownContent) {
		if(typeof config.base_url !== 'undefined') markdownContent = markdownContent.replace(/\%base_url\%/g, config.base_url);
		if (typeof config.image_url !== 'undefined') markdownContent = markdownContent.replace(/\%image_url\%/g, config.image_url);
		return markdownContent;
	},

	getPage: function(path) {
		try {
			var file = fs.readFileSync(path),
				slug = path.replace(__dirname +'/content/', '').trim();

			if(slug.indexOf('index.md') > -1){
				slug = slug.replace('index.md', '');
			}
			slug = slug.replace('.md', '').trim();

			var meta = raneto.processMeta(file.toString('utf-8')),
				content = raneto.stripMeta(file.toString('utf-8'));
			content = raneto.processVars(content);
			var html = marked(content);

			return {
				'slug': slug,
				'title': meta.title ? meta.title : 'Untitled',
				'body': html,
				'excerpt': _s.prune(_s.stripTags(_s.unescapeHTML(html)), config.excerpt_length)
			};
		}
		catch(e){}
		return null;
	},

	getPages: function(activeSlug) {
		var page_sort_meta = config.page_sort_meta || '',
			category_sort = config.category_sort || false,
			files = glob.sync(__dirname +'/content/**/*'),
			filesProcessed = [];

		filesProcessed.push({
			slug: '.',
			title: '',
			is_index: true,
			class: 'category-index',
			sort: 0,
			files: []
		});

		files.forEach(function(filePath){
            var dir = __dirname.replace(/\\/g, "/") + '/content/';
            var shortPath = filePath.replace(dir, '').trim(),
				stat = fs.lstatSync(filePath);

			if(stat.isDirectory()){
				var sort = 0;
				if(category_sort){
					try {
						var sortFile = fs.readFileSync(__dirname +'/content/'+ shortPath +'/sort');
						sort = parseInt(sortFile.toString('utf-8'), 10);
					}
					catch(e){
						console.log(e);
					}
				}

				filesProcessed.push({
					slug: shortPath,
					title: _s.titleize(_s.humanize(path.basename(shortPath))),
					is_index: false,
					class: 'category-'+ raneto.cleanString(shortPath.replace(/\//g, ' ')),
					sort: sort,
					files: []
				});
			}
			if(stat.isFile() && path.extname(shortPath) == '.md'){
				try {
					var file = fs.readFileSync(filePath),
						slug = shortPath,
						pageSort = 0;

					if(shortPath.indexOf('index.md') > -1){
						slug = slug.replace('index.md', '');
					}
					slug = slug.replace('.md', '').trim();

					var dir = path.dirname(shortPath),
						meta = raneto.processMeta(file.toString('utf-8'));

					if(page_sort_meta && meta[page_sort_meta]) pageSort = parseInt(meta[page_sort_meta], 10);

					var val = _.find(filesProcessed, function(item){ return item.slug == dir; });
					val.files.push({
						slug: slug,
						title: meta.title ? meta.title : 'Untitled',
						active: (activeSlug.trim() == '/'+ slug),
						sort: pageSort
					});
				}
				catch(e){}
			}
		});

		filesProcessed = _.sortBy(filesProcessed, function(cat){ return cat.sort; });
		filesProcessed.forEach(function(category){
			category.files = _.sortBy(category.files, function(file){ return file.sort; });
		});

		return filesProcessed;
	},

	search: function(query) {
		var files = glob.sync(__dirname +'/content/**/*.md');
		var idx = lunr(function(){
			this.field('title', { boost: 10 });
			this.field('body');
		});

		files.forEach(function(filePath){
			try {
				var shortPath = filePath.replace(__dirname +'/content/', '').trim(),
					file = fs.readFileSync(filePath);

				var meta = raneto.processMeta(file.toString('utf-8'));
				idx.add({
					'id': shortPath,
					'title': meta.title ? meta.title : 'Untitled',
					'body': file.toString('utf-8')
				});
			}
			catch(e){}
		});

		return idx.search(query);
	},

	handleRequest: function(req, res, next) {
		if(req.query.search){
			var searchQuery = validator.toString(validator.escape(_s.stripTags(req.query.search))).trim();
			var searchResults = raneto.search(searchQuery);
			searchResults.forEach(function(result){
				var page = raneto.getPage(__dirname +'/content/'+ result.ref);
				page.excerpt = page.excerpt.replace(new RegExp('('+ searchQuery +')', 'gim'), '<span class="search-query">$1</span>');
				searchResults.push(page);
			});

			var pageListSearch = raneto.getPages('');
			return res.render('search', {
				config: config,
				pages: pageListSearch,
				search: searchQuery,
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
					content = raneto.processVars(content);
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
	},

	handleError: function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			config: config,
			status: err.status,
			message: err.message,
			error: {},
			body_class: 'page-error'
		});
	}

};

module.exports = raneto;
