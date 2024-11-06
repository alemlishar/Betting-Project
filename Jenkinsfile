pipeline {
    agent {
        docker {
            image 'node:14'
        }
    }

    triggers { // specify trigger configuration
        gitlab(
                triggerOnPush: true,
                branchFilterType: "All",
                ciSkip: false,
                noteRegex: "Jenkins please retry a build",
                setBuildDescription: true,
                addCiMessage: true,
                acceptMergeRequestOnSuccess: false,
                secretToken: "b7010c43252cc970a89419be61078187")
    }

    environment {
        HOME = '.'
    }
    stages {
        stage('Build') {
            steps {
                sh '''  git config user.email jenkins@dummy.dom
                        git config user.name 'Jenkins Build'
                        npm cache clean --force
                        npm install && npm run build
                   '''
            }
        }
        stage('Publish node artifacts'){
            steps {
                sh '''  npm run pub
                        git status
                   '''

            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
