# Test Smart Home Skill

Now, you can try control the Smart Lamp power status using voice.

## Change ON/OFF status of smart lamp

1. Make sure your smart lamp simulator is running

1. Try speak `Alexa, turn on <device-friendly-name>` to Alexa App

1. Try speak `Alexa, turn off <device-friendly-name>` to Alexa App

1. Check you **Smart Lamp Simulator output**

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask), 
select your Skill

1. Click the **Test** tab, and try input **turn on the <device-friendly-name>**
![](assets/alexa-console-test.png)


## Smart home group practice (Optional) 

You may have multiple lamps in multiple rooms. Try create one living room, one bedroom, two lamps.
Put one lamp in each room, and try **Alexa, turn on the Lamp in bedroom**.

1. create another Smart Lamp

1. Bind Smart Lamp to user

1. Run **Discover** again

1. Create groups

1. Associate groups and devices

1. Edit friendly name of device


## Standard Smart Light device practice (Optional)

Now the Smart Lamp is considered as an "Other" device in Alexa App.
Modify the code to make the lamp can be recognized as a standard Alexa-Enabled **Light**. 
If doing so, you can control the Light device by tap the Lamp' ON/OFF button in Alexa App.