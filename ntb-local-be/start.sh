#!/bin/sh

set -e
set -x

git config --global credential.helper store
git config --global credential.helper 'store --file /home/volume/.git-credentials'

cd /home/volume

if [ ! -d "apache-maven-3.6.3" ]; then
  wget https://downloads.apache.org/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz -O apache-maven-3.6.3-bin.tar.gz
  tar xf apache-maven-3.6.3-bin.tar.gz
  rm apache-maven-3.6.3-bin.tar.gz
fi

alias mvn=/home/volume/apache-maven-3.6.3/bin/mvn
mvn --version

if cd sisal-kura
then
  git checkout develop
else
  git clone http://git-ita.nplts.sisal.it/betting/sisal-kura.git
  cd sisal-kura
  git checkout develop
fi

git fetch origin
echo "type branch to start then enter (type develop if you do not know which one)"
git branch -r --no-merged
read BRANCH

git branch -D to-be-deployed || true
git checkout -b to-be-deployed origin/$BRANCH
git pull

SOURCE_DIR=/home/volume/sisal-kura/bundles

TARGET_DIR=/opt/eclipse/kura/data
mkdir -p $TARGET_DIR/packages

cd $SOURCE_DIR/core/shared-libraries
mvn clean install -s /home/settings.xml
cp target/shared-libraries_1.0.0-SNAPSHOT.dp $TARGET_DIR/packages/

cd $SOURCE_DIR/core
mvn clean install -s /home/settings.xml

cd $SOURCE_DIR/core/distrib
mvn clean install -s /home/settings.xml
cp target/core-distrib_1.0.0-SNAPSHOT.dp $TARGET_DIR/packages/

cd $SOURCE_DIR/betting
mvn clean install -s /home/settings.xml

cd $SOURCE_DIR/betting/distrib
mvn clean install -s /home/settings.xml
cp target/betting-distrib_1.0.0-SNAPSHOT.dp $TARGET_DIR/packages/

rm $TARGET_DIR/dpa.properties
echo "shared-libraries=file\:/opt/eclipse/kura/data/packages/shared-libraries_1.0.0-SNAPSHOT.dp" >> $TARGET_DIR/dpa.properties
echo "core-distrib=file\:/opt/eclipse/kura/data/packages/core-distrib_1.0.0-SNAPSHOT.dp" >> $TARGET_DIR/dpa.properties
echo "betting-distrib=file\:/opt/eclipse/kura/data/packages/betting-distrib_1.0.0-SNAPSHOT.dp" >> $TARGET_DIR/dpa.properties

/opt/start.sh
