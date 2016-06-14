#!/bin/bash -e
# @author Arnaud Weyts
# this uses npm & jpm to make the xpi file
if test $# -ne 1; then
  echo "Usage: xpimake.sh <add-on dir>"
  exit 1
fi

dir=$1

#gets the right version
VERSION="$(git name-rev --tags --name-only $(git rev-parse HEAD))"

cd "$dir"

# installs dependencies
npm install jpm

# set path so jpm can be used wihout npm
export PATH="$dir/node_modules/.bin/:$PATH"

# make the xpi using jpm
jpm xpi
echo "Wrote unsigned xpi file"

# if beta => don't sign
if [[ $VERSION != *"beta"* ]];then
    # this fixes build errors if the same version is being signed twice
    if jpm sign --api-key $FIREFOX_API --api-secret $FIREFOX_SECRET --xpi *.xpi ; then
        echo "Signed xpi file"
        rm @*.xpi
        echo "Removed unsigned xpi file"
        # move the xpi file to the root directory
        mv ./*.xpi ../firefox.xpi
    else
        echo "Signing failed, using unsigned file"
        mv ./*xpi ../firefox-unsigned.xpi
    fi
fi