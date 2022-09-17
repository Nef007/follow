

module.exports = async (linkUser, linkMy, instagram) =>  {

    const regex = /https:\/\/www\.instagram\.com\/(.*)/;
    const userName = regex.exec(linkUser)[1].split("/")[0];
    const myName = regex.exec(linkMy)[1].split("/")[0];

    const userData = await instagram.getUserDataByUsername(userName)

    const followers = await instagram.getUserFollowers(userData.graphql.user.id)

    return followers.includes(myName)

}

