const CONFIG = {
	"apiLogging": "",
	"development": {
		"PORT": 5000,
		"protocol": "http",
		"URL": "localhost",
		"DOMAIN_NAME": "localhost"
	},
	"testing": {
		"PORT": 5000,
		"protocol": "https",
		"URL": "141.94.205.232",
		"DOMAIN_NAME": "rivus-io.com"
	},
	"production": {
		"PORT": 5000,
		"protocol": "https",
		"URL": "141.94.205.232",
		"DOMAIN_NAME": "rivus-io.com"
	}
};

export default CONFIG;
