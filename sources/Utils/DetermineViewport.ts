
// a good read: http://stackoverflow.com/questions/9038625/detect-if-device-is-ios

let devices = [
	'android',
	'iphone',
	'ipad',
	'blackberry',
	'symbian',
	'symbianos',
	'symbos',
	'netfront',
	'model-orange',
	'javaplatform',
	'iemobile',
	'windows phone',
	'samsung',
	'htc',
	'opera mobile',
	'opera mobi',
	'opera mini',
	'presto',
	'huawei',
	'blazer',
	'bolt',
	'doris',
	'fennec',
	'gobrowser',
	'iris',
	'maemo browser',
	'mib',
	'cldc',
	'minimo',
	'semc-browser',
	'skyfire',
	'teashark',
	'teleca',
	'uzard',
	'uzardweb',
	'meego',
	'nokia',
	'bb10',
	'playbook'
].join('|');

interface iScreen {
	width: number;
	height: number;
}

let regex = '/('+devices+')/gi';

let landscape:iScreen = {width: 480, height: 800};
let portrait: iScreen = {width: 800, height: 480};

let screenLargerThan = function (s1:iScreen, s2:iScreen) {
	return s1.width >= s2.width && s1.height >= s2.height;
}

let $MOBILE_PHONE = screenLargerThan(screen,landscape) || screenLargerThan(screen,portrait) || navigator.userAgent.match(/ipad/gi)
	? false // tablet or desktop
	: true; // mobile

if ($MOBILE_PHONE) {
	document.getElementById('metaViewport').setAttribute("content",(function(a:string[], o:Object){
		for (let i in o) {a.push(i+'='+o[i]);}
		return a;
	}([],{
		'width': 'device-width',
		'maximum-scale': '0.7',
		'initial-scale': '0.7',
		'user-scalable': 'no',
	})).join(', '));
	(<any>window).$MOBILE_PHONE = true;
}
