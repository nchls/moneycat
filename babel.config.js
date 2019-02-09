const presets = [
	["@babel/preset-react"],
	["@babel/env", {
		targets: {
			browsers: [
				'Chrome >= 70',
				'Safari >= 11',
				'iOS >= 11',
				'Firefox >= 63',
				'Edge >= 17'
			]
		},
		useBuiltIns: "usage"
	}]
];

module.exports = { presets };
