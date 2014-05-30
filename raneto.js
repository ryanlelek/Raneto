var path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	marked = require('marked'),
	lunr = require('lunr');

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

	processVars: function(markdownContent, config) {
		if(typeof config.base_url !== 'undefined') markdownContent = markdownContent.replace(/\%base_url\%/g, config.base_url);
		return markdownContent;
	},

	getPage: function(path, config) {
		var file = fs.readFileSync(path);
		if(file){
			var slug = path.replace(__dirname +'/content/', '').trim();
			if(slug.indexOf('index.md') > -1){
				slug = slug.replace('index.md', '');
			}
			slug = slug.replace('.md', '').trim();

			var meta = raneto.processMeta(file.toString('utf-8')),
				content = raneto.stripMeta(file.toString('utf-8'));
			content = raneto.processVars(content, config);
			var html = marked(content);

			return {
				'slug': slug,
				'title': meta.title ? meta.title : 'Untitled',
				'body': html,
				'excerpt': _s.prune(_s.stripTags(_s.unescapeHTML(html)), config.excerpt_length)
			};
		}
		return null;
	},

	getPages: function(activeSlug) {
		var files = glob.sync(__dirname +'/content/**/*'),
			filesProcessed = [];

		filesProcessed.push({
			slug: '.',
			title: '',
			is_index: true,
			class: 'category-index',
			files: []
		});

		files.forEach(function(filePath){
			var shortPath = filePath.replace(__dirname +'/content/', '').trim(),
				stat = fs.lstatSync(filePath);

			if(stat.isDirectory()){
				filesProcessed.push({
					slug: shortPath,
					title: _s.titleize(_s.humanize(path.basename(shortPath))),
					is_index: false,
					class: 'category-'+ raneto.cleanString(shortPath.replace(/\//g, ' ')),
					files: []
				});
			}
			if(stat.isFile() && path.extname(shortPath) == '.md'){
				var file = fs.readFileSync(filePath);
				if(file){
					var slug = shortPath;
					if(shortPath.indexOf('index.md') > -1){
						slug = slug.replace('index.md', '');
					}
					slug = slug.replace('.md', '').trim();

					var dir = path.dirname(shortPath),
						meta = raneto.processMeta(file.toString('utf-8'));

					var val = _.find(filesProcessed, function(item){ return item.slug == dir; });
					val.files.push({
						slug: slug,
						title: meta.title ? meta.title : 'Untitled',
						active: (activeSlug.trim() == '/'+ slug)
					});
				}
			}
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
			var shortPath = filePath.replace(__dirname +'/content/', '').trim(),
				file = fs.readFileSync(filePath);

			if(file){
				var meta = raneto.processMeta(file.toString('utf-8'));
				idx.add({
					'id': shortPath,
					'title': meta.title ? meta.title : 'Untitled',
					'body': file.toString('utf-8')
				});
			}
		});

		return idx.search(query);
	}

};

module.exports = raneto;
