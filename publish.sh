version=$1
echo "Publishing version $version"

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

npm version $version
git push
git push --tags
npm publish