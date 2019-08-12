# AWS-Alexa Workshop Smart Home
In this lab, you will learn how to build a virtual Alexa-Enabled
Smart Lamp using various AWS Services.

For the first time rung this lab, please use all AWS resources in 
N.Virginia region (us-east-1).

![](docs/assets/alexa-workshop-arch.jpg)

The above is the overall architect of this Lab. In this lab, you will create:

* A virtual Alexa-Enabled Smart Home Lamp
* A device binding system using AppSync, Cognito User Pool, Lambda, DynamoDB
* An Alexa backend which handles directives from Alexa and control the power status 
of Lamp via IoT Core

## Table of Contents

Please following the steps to build your first Alexa-Enabled Lamp.

**Before your start the lab, Git clone this lab to local.**

1. [Create a Web Interface to bind Smart Lamp to User](https://github.com/lab798/aws-alexa-workshop-ui)
1. [Setup Smart Lamp Simulator](https://github.com/lab798/aws-alexa-workshop-smarthome-lamp)
1. [Bind Smart Lamp to user](docs/bind-device.md)
1. [Create Smart Home Skill in Alexa Developer Console](docs/create-skill.md)
1. [Create Client in Cognito User Pool](docs/create-cup-client.md)
1. [Configure Account Linking Settings](docs/account-linking.md)
1. [Setup the Lambda Function](docs/create-lambda.md)
1. [Run Device Discovery](docs/device-discovery.md)
1. [Test Skill](docs/test-skill.md)


## Tips

You must strictly follow the Alexa language and AWS Lambda region specs. Otherwise,
you will not be able to receive directives from Alexa. 

**Smart Home Skill Regions**
* N.Virginia for English (US) or English (CA) skills
* EU (Ireland) region for English (UK), English (IN), German or French (FR) skills
* US West (Oregon) for Japanese and English (AU) skills.
