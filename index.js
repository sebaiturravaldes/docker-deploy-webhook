/**
 * A service for automated deployment from Docker Hub to Docker Swarm
 * https://docs.docker.com/docker-hub/webhooks/
 */
process.env.PORT = process.env.PORT || 80

const express = require('express')
const bodyParser = require('body-parser')
const child_process = require('child_process')
const app = express()
const Package = require('./package.json')
const services = require(`./config.json`)[process.env.CONFIG || 'production']

if (!process.env.TOKEN)
    return console.error("Error: You must set a TOKEN as environment variables.")

const dockerCommand = process.env.DOCKER || '/usr/bin/docker'
const token = process.env.TOKEN || ''

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/webhook/:token', (req, res) => {
    if (!req.params.token || req.params.token != token) {
        console.log("Webhook called with invalid or missing token.")
        return res.status(401).send('Access Denied: Token Invalid\n').end()
    }

    // Send response back right away if token was valid
    res.send('OK')

    const payload = req.body
    const image = `${payload.repository.repo_name}:${payload.push_data.tag}`

    if (!services[image]) return console.log(`Received updated for "${image}" but not configured to handle updates for this image.`)

    const service = services[image].service

    // Deploy the image and force a restart of the associated service
    console.log(`Deploying ${image} to ${service}...`)
    child_process.exec(`${dockerCommand} service update ${service} --force --image=${image}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Failed to deploy ${image} to ${service}!`)
                return console.error(error)
            }
            console.log(`Deployed ${image} to ${service} successfully and restarted the service.`)
        })
})

app.all('*', (req, res) => {
    res.send('')
})

app.listen(process.env.PORT, err => {
    if (err) throw err
    console.log(`Listening for webhooks on http://localhost:${process.env.PORT}/webhook/${token}`)
})
