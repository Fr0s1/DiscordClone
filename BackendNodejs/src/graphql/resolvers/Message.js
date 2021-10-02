async function files(parent, args, context) {
    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT

    const files = await context.axios.post(`${FILE_SERVER_ENDPOINT}/message/files`, {
        messageId: parent._id,
        files: parent.files
    })

    console.log(files.data)

    return files.data
}

module.exports = {
    files
}