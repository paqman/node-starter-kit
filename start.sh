#!/bin/sh

if [[ $# = 0 || $1 = "DEV" ]]; then
	cd src
	node server.js
elif [[ $1 = "PROD" ]]; then
	grunt
	cd dist
	NODE_ENV=production node server.js
else
	echo "USAGE $0 <PROD|DEV>"
	exit 1
fi

exit 0