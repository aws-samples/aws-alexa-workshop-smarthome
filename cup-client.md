# Create a client in Cognito User Pool

## Create Cognito User Pool

Skip this part if you already have a Cognito User Poool. If you followed 
the [Create a Web Interface to bind Smart Lamp to user](https://github.com/lab798/aws-alexa-workshop-ui),
you should already have one.

1. Open [Amazon Cognito Console](https://console.aws.amazon.com/cognito/home)

2. Choose **Manage User Pools**

3. On the top right corner，choose **Create a user pool**

4. 为您的用户池指定一个名称，然后选择**查看默认值**以保存该名称。

5. 在**属性**页面上，选择**电子邮件地址或电话号码**，然后选择**允许使用电子邮件地址**。

6. 在页面底部，选择**下一步**以保存属性。

7. 在页面左侧的导航栏上，选择**审核**。

8. 在**审核**页面底部，选择**创建池**。

## Create a Cognito User Pool Client

