## Code used to create a local and remote git(hub) repo
## modified from
## https://viget.com/extend/create-a-github-repo-from-the-command-line
## To use,
## 1. add this file to <PATH>
## 2. add the following line to startup files: . <PATH>/github-create.sh
## 3. source startup files
## 4. cd to the directory you'd like to create a git folder and type
##    github-create <foldername>

github-creat() {

    repo_name=$1

    dir_name=`basename $(pwd)`

    if [ "$repo_name" = "" ]; then
	echo "Repo name (hit enter to use '$dir_name')?"
	read repo_name
    fi

    if [ "$repo_name" = "" ]; then
	repo_name=$dir_name
    fi

    username=`git config github.user`
    if [ "$username" = "" ]; then
	echo "Could not find username, run 'git config --global github.user <username>'"
	invalid_credentials=1
    else
	invalid_credentials=0
    fi

    token=`git config github.token`
    if [ "$token" = "" ]; then
	echo "Could not find token, run 'git config --global github.token <token>'"
	invalid_credentials=1
    else
	invalid_credentials=0
    fi

    if [ "$invalid_credentials" == "1" ]; then
	return 1
    fi

    echo -n "Creating local Github repository '$repo_name' and initializing ..." 
    mkdir $repo_name
    cd $repo_name
    echo "# $repo_name" >> README.md
    git init > /dev/null 2>&1
    echo " done."

    echo -n "Creating remote Github repository '$repo_name' ..."
    curl -u "$username:$token" https://api.github.com/user/repos -d '{"name":"'$repo_name'", "private": true}' > /dev/null 2>&1
    echo " done."

    git add README.md > /dev/null 2>&1
    git commit -m "first commit" > /dev/null 2>&1

    echo -n "Pushing local code to remote ..."
    git remote add origin https://github.com/$username/$repo_name.git > /dev/null 2>&1
    git push -u origin master > /dev/null 2>&1
    echo " done."

}
