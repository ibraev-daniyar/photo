const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clean = () => {
	return del(['dist'])
}

const resources = () => {
	return src('src/resources/**')
			.pipe(dest('dist'))
}

const styles = () => {
	return src('src/styles/**/*.css')
			.pipe(sourcemaps.init())
			.pipe(concat('style.css'))
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(sourcemaps.write())
			.pipe(dest('dist/styles'))
			.pipe(browserSync.stream())
}

const htmlMinify = () => {
	return src('src/**/*.html')
			.pipe(dest('dist'))
			.pipe(browserSync.stream())
}

const svgSprites = () => {
	return src('src/images/svg/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}

const scripts = () => {
	return src([
			'src/js/components/**/*.js',
			'src/js/main.js'
		])
			.pipe(sourcemaps.init())
			.pipe(concat('app.js'))
			.pipe(sourcemaps.write())
			.pipe(dest('dist'))
			.pipe(browserSync.stream())
}

const images = () => {
	return src([
			'src/images/**/*.jpg',
			'src/images/**/*.png',
			'src/images/*.svg',
			'src/images/**/*.jpeg'
	],
		{encoding: false})
		.pipe(image())
		.pipe(dest('dist/images'))
}

const watchFiles = () => {
	browserSync.init({
		server:	{
			baseDir: 'dist'
		}
	})
}

watch('src/**/*.html', htmlMinify);
watch('src/**/*.css', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.default = series(
	clean,
	// resources,
	htmlMinify,
	// scripts,
	styles,
	images,
	svgSprites,
	watchFiles,
)

const cleanBuild = () => {
	return del(['build'])
}

const resourcesBuild = () => {
	return src('src/resources/**')
			.pipe(dest('build'))
}

const stylesBuild = () => {
	return src('src/styles/**/*.css')
			.pipe(concat('style.css'))
			.pipe(autoprefixer({
				cascade: false
			}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(dest('build/styles'))
			.pipe(browserSync.stream())
}

const htmlMinifyBuild = () => {
	return src('src/**/*.html')
			.pipe(htmlMin({
				collapseWhitespace: true,
			}))
			.pipe(dest('build'))
			.pipe(browserSync.stream())
}

const svgSpritesBuild = () => {
	return src('src/images/svg/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('build/images'))
    .pipe(browserSync.stream())
}

const scriptsBuild = () => {
	return src([
				'src/js/components/**/*.js',
				'src/js/main.js'
			])
			.pipe(babel({
				presets: ['@babel/env']
			}))
			.pipe(concat('app.js'))
			.pipe(uglify(
				{toplevel: true}
			).on('error', notify.onError()))
			.pipe(dest('build'))
			.pipe(browserSync.stream())
}

const imagesBuild = () => {
	return src([
			'src/images/**/*.jpg',
			'src/images/**/*.png',
			'src/images/*.svg',
			'src/images/**/*.jpeg'
	],
		{encoding: false})
		.pipe(image())
		.pipe(dest('build/images'))
}

const watchFilesBuild = () => {
	browserSync.init({
		server:	{
			baseDir: 'build'
		}
	})
}

watch('src/**/*.html', htmlMinifyBuild);
watch('src/**/*.css', stylesBuild);
watch('src/images/svg/**/*.svg', svgSpritesBuild);
watch('src/js/**/*.js', scriptsBuild);
watch('src/resources/**', resourcesBuild);

exports.clean = cleanBuild
exports.styles = stylesBuild
exports.scripts = scriptsBuild
exports.htmlMinify = htmlMinifyBuild
exports.build = series(
	cleanBuild,
	// resourcesBuild,
	htmlMinifyBuild,
	// scriptsBuild,
	stylesBuild,
	imagesBuild,
	svgSpritesBuild,
	watchFilesBuild,
)
