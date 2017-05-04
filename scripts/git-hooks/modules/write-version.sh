#!/usr/bin/env bash

VERSION_FILE=$(__get_version_file)
VERSION_PREFIX=$(git config --get gitflow.prefix.versiontag)

if [ ! -z "$VERSION_PREFIX" ]; then
    VERSION=${VERSION#$VERSION_PREFIX}
fi

if [ -z "$VERSION_BUMP_MESSAGE" ]; then
    VERSION_BUMP_MESSAGE="release: %version%"
fi

VER=$(cat $ROOT_DIR/package.json | grep -m 1 "version" | awk '{ print $2 }' | sed s/\"//g | sed s/\,//g);

sed -i.bck s/${VER}/${VERSION}/g $ROOT_DIR/package.json
rm $ROOT_DIR/package.json.bck

$ROOT_DIR/node_modules/.bin/conventional-changelog -p angular -i $ROOT_DIR/CHANGELOG.md -s -r 0

echo -n "$VERSION" > $VERSION_FILE && \
    git add $VERSION_FILE && \
    git add $ROOT_DIR/package.json && \
    git add $ROOT_DIR/CHANGELOG.md && \
    git commit -m "$(echo "$VERSION_BUMP_MESSAGE" | sed s/%version%/$VERSION/g)"

if [ $? -ne 0 ]; then
    __print_fail "Unable to write version to $VERSION_FILE."
    return 1
else
    return 0
fi
