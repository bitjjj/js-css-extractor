let path = require('path'),
	fs = require('fs'),
	cheerio = require('cheerio');

function handle ({src, dest, cssDest = path.posix.join(dest,'css'), jsDest = path.posix.join(dest,'js')}) {
	console.log(src,dest,cssDest,jsDest);
	if (!Array.isArray(src)) {
		src = [src];
	}

	for (let i = 0; i < src.length; i++) {
		let srcFile = src[i], content = fs.readFileSync(srcFile, 'utf-8'), $ = cheerio.load(content);

		let destCssName = path.posix.basename(srcFile).replace(/\.([^.]+)$/, ".css"), 
			destCssPath = path.posix.join(cssDest, destCssName),
			destJsName = path.posix.basename(srcFile).replace(/\.([^.]+)$/, ".js"), 
			destJsPath = path.posix.join(jsDest, destJsName),
			$links = $("link"), $scipts = $("script");

		if ($links.length > 0) {
			fs.existsSync(destCssPath) && fs.unlinkSync(destCssPath);
			fs.writeFileSync(destCssPath);
			let w = fs.createWriteStream(destCssPath);
			
			$links.filter(function(i, ele){
				return $(this).attr("href") && $(this).attr("href").endsWith(".css"); 
			}).each(function(i, elem) {
		  		let href = $(this).attr("href");
		  			r = fs.createReadStream(path.posix.join(path.posix.dirname(srcFile),href));
		  		console.log(path.posix.join(path.posix.dirname(srcFile),href));
		  		r.pipe(w);
			});
		}

		if ($scipts.length) {
			fs.existsSync(destJsPath) && fs.unlinkSync(destJsPath);
			fs.writeFileSync(destJsPath);
			let w = fs.createWriteStream(destJsPath);

			$scipts.filter(function(i, ele){
				return $(this).attr("src") && $(this).attr("src").endsWith(".js"); 
			}).each(function(i, elem) {
		  		let src = $(this).attr("src");
		  			r = fs.createReadStream(path.posix.join(path.posix.dirname(srcFile),src));
		  		console.log(path.posix.join(path.posix.dirname(srcFile),src));
		  		r.pipe(w);
			});
		}

		
	}
}

handle({src:'../labelpp-frontend/page/landing.html', dest:'../labelpp-frontend/dist'});


exports = function (src, dest) {

}