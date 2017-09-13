var path = require('path'),
	fs = require('fs'),
	cheerio = require('cheerio');

function handle (src, dest) {
	if (!Array.isArray(src)) {
		src = [src];
	}

	for (var i = 0; i < src.length; i++) {
		var srcFile = src[i], content = fs.readFileSync(srcFile, 'utf-8'), $ = cheerio.load(content);

		var destCssName = path.posix.basename(srcFile).replace(/\.([^.]+)$/, ".css"), 
			destCssPath = path.posix.join(dest, destCssName),
			$links = $("link");

		if ($links.length > 0) {
			fs.existsSync(destCssPath) && fs.unlinkSync(destCssPath);
			fs.writeFileSync(destCssPath);
			var w = fs.createWriteStream(destCssPath);
			
			$("link").filter(function(i, ele){
				return $(this).attr("href") && $(this).attr("href").endsWith(".css"); 
			}).each(function(i, elem) {

		  		var href = $(this).attr("href");
		  			r = fs.createReadStream(path.posix.join(path.posix.dirname(srcFile),href));
		  		console.log(path.posix.join(path.posix.dirname(srcFile),href));
		  		r.pipe(w);
			});
		}
	}
}

handle('../labelpp-frontend/page/landing.html', '../labelpp-frontend/dist/css');


exports = function (src, dest) {

}