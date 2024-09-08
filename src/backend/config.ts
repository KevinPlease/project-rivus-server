const config = {
	"DB": {
		"development": {
			"PORT": 27017,
			"HOST": "127.0.0.1"
		},
		"testing": {
			"PORT": 27017,
			"HOST": "127.0.0.1"
		},
		"production": {
			"PORT": 27017,
			"HOST": "127.0.0.1"
		}
	},

	"TOKEN_SECRET":  "@CJFJ2903jfas30DJ093j@$jf0aj9f",
	
	"LOGS_FOR": {
		"ROOT": "logs",
		"SYSTEM": "system",
		"API": "api"
	},

	"SERVER_CERTIFICATION": {
		"testing": {
			"privateKey": "/etc/letsencrypt/live/catasta.io/privkey.pem",
			"certification": "/etc/letsencrypt/live/catasta.io/cert.pem",
			"chain": "/etc/letsencrypt/live/catasta.io/chain.pem"
		},
		"production": {
			"privateKey": "/etc/letsencrypt/live/catasta.io/privkey.pem",
			"certification": "/etc/letsencrypt/live/catasta.io/cert.pem",
			"chain": "/etc/letsencrypt/live/catasta.io/chain.pem"
		}
	},
	
	"verboseEnabled": false
};

export default config;
