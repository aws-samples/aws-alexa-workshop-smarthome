# Bind Device to User 

Scan the QR Code shipped with the virtual Smart Lamp to create binding
relationship between device and user.

1. Make sure your Smart Lamp Simulator is running

1. Use your Camera to **scan** the generated QR Code

1. The browser will be navigated to a login page, create an account if don't
have one

1. Sign In and it will be navigated to **Device Binding** page

1. Click the **Bind** button   

![](assets/ui-device-bind.png)

1. Refresh the page to check if the button's status has changed to **Unbind**

1. Go to [DynamoDB Console](https://console.aws.amazon.com/dynamodb/home?region=us-east-1) to check the item in table named 'Device-xxxxxxx'.

The above could be one of the ways to create relationship between devices and users.
Alexa does not have requirement for this. It is your own responsibility to design
the workflow.
