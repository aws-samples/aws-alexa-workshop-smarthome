# AWS Cognito User Pool 实现 Alexa 账户关联

> 完成本实验预计使用1小时
> 完成该实验需要可以一个已经注册好的 Alexa Skill, 并且能够在 Alexa App 或者 Alex Web Portal 中显示该 Alexa Skill。

本文将介绍如何利用AWS Cognito User Pool 实现 Alexa 的账户关联。这里将不涉及到 Cognito 或者 Alexa 相关的开发。有关 Cognito User Pool 的更多资料请参考
[官方文档](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)。
有关Alexa的开发资料请参考 [Alexa Developer Portal](https://developer.amazon.com/alexa)。

## 什么是账户关联
账户关联(Account Linking)允许将用户在Alexa账号系统中的身份与另外一个账号系统中的身份关联起来。
假设这样的一个问题，系统X中存在用户a和用户b, Alexa 账户体系中存在用户A和用户B, 那么系统X收到来自
Alexa的指令后，如何区分这是来自用户a的请求还是用户b的呢？账户关联就是为了解决这个问题，将Alexa的账户
系统与另一个账号系统中的身份关联起来。

Alexa账户关联是标准的 OAuth2.0 授权, 本文不深入探讨 OAuth2.0, 有关 OAuth2.0 的理解可以参考
[理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)。

AWS的 [Cognito User Pool](https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/cognito-user-identity-pools.html)提
供了标准的 OAuth 2.0 的认证和授权，因此借助 Cognito User Pool 可以快速实现和 Alexa 的账户关联。

下面这张流程图展示了一个用户在 Alexa APP 中进行账户关联，Alexa 是如何从授权服务器获得 AccessToken 的整个过程。

![Auth-Code-Flow](http://cdn.quickstart.org.cn/assets/alexa/account-linking/auth-code-flow.png)

在完成 Alexa 的账户关联之后，用户与 Skill 交互产生的指令会被发送到 Resource Server, 该指令中包含用户的 AccessToken。
这里的 Resource Server 就是 Alexa Kill 控制中配置的 [**Endpoint**](https://developer.amazon.com/zh/docs/custom-skills/host-a-custom-skill-as-a-web-service.html)。

在 Resource Server 上，通过 Decode AccessToken, 能够获得用户名。

![Flow](http://cdn.quickstart.org.cn/assets/alexa/account-linking/skill-interaction-flow.png)

## 配置Cognito User Pool
AWS Cognito User Pool提供了基于OAuth 2.0的实现，这里提供详细的Cognito User Pool的配置流程。

### 创建Cognito User Pool
1. 打开 [Amazon Cognito Console](https://console.aws.amazon.com/cognito/home)。

2. 选择 **管理用户池**。

3. 在页面右上角，选择**创建用户池**。

4. 为您的用户池指定一个名称，然后选择**查看默认值**以保存该名称。

5. 在**属性**页面上，选择**电子邮件地址或电话号码**，然后选择**允许使用电子邮件地址**。

6. 在页面底部，选择**下一步**以保存属性。

7. 在页面左侧的导航栏上，选择**审核**。

8. 在**审核**页面底部，选择**创建池**。

### 创建应用程序客户端
您可以为用户池创建多个应用程序，通常一个应用程序对应于该应用程序的平台。在和Alexa的结合的
场景中，Alexa是用户池的一个应用程序客户端。

1. 在页面左侧的导航栏上，选择**应用程序客户端**。

2. 在**应用程序客户端**选项卡中，选择**添加应用程序客户端**

3. 指定**应用程序客户端名称**

4. 指定应用程序的**刷新令牌的到期时间 (天)**。默认值是 30。
您可以将其更改为 1 到 3650 之间的任何值。

5. 在页面底部，选择**创建应用程序客户端**。

### 配置应用程序客户端 OAuth 2.0 设置
默认情况下应用程序客户端的 OAuth 2.0 是不开放的，按照以下步骤，打开客户端的 OAuth 2.0 认证与授权。

1. 在页面左侧的导航栏上，选择**应用程序客户端设置**。

2. 找到刚才创建的应用程序客户端。

3. 在**启用身份提供商**中，选择 **Cognito User Pool** 。

4. 在**回调 URL** 中，指定 Alexa Kill 的 **Redirect URLs**。

 > 在 Alexa Console 中选择需要配置的 Alexa Skill, 在左侧页面导航栏选择 **Account Linking**, 网页底部找到的 **Redirect URLs**。 
 
 > Alexa 根据用户在哪里注册的设备，跳转到不同的URL, 为了服务所有Alexa用户，建议将三个Redirect URL都填入Cognito，点击查看[更多信息](https://developer.amazon.com/docs/account-linking/configure-authorization-code-grant.html#redirect-url-values)

 ![Redirect Urls](http://cdn.quickstart.org.cn/assets/alexa/account-linking/redirect-urls.png)

5. 在**允许的 OAuth 流程**中，选择 **Authorization code grant**。

6. 在**许的 OAuth 范围**中，至少选择 **openid**。

7. 选择**保存修改**。

 ![OAuth 2.0配置](http://cdn.quickstart.org.cn/assets/alexa/account-linking/enable-oauth.png)

### 配置 Cognito User Pool 认证域名
Cognito 域名是 Alexa 进行 OAuth2.0 认证时的跳转域名。默认的域名为`https://<domain-prefix>.auth.<region>.amazoncognito.com`。
您可以配置自己的域名，关于如何配置自己的域名，请参考[将自定义域添加到用户池](https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html)。
本文将使用AWS提供的默认域名。

1. 在页面左侧的导航栏上，选择**域名**。

2. 指定**您的域名**，选择**检查可用性**。

3. 当提示为**此域可用**后，选择**保存更改**。

 ![域名](http://cdn.quickstart.org.cn/assets/alexa/account-linking/cognito-domain.png)

> 请记录 Cognito User Pool 的认证域名，可以使用默认域名或者自己的域名，在后续的Alexa配置中需要使用。

### 配置 Amazon Cognito认证UI（可选）
Amazon Cognito提供默认的UI, 如下图:

 ![默认UI](http://cdn.quickstart.org.cn/assets/alexa/account-linking/cognito-UI.png)

可以根据[自定义内置登录网页和注册网页](https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/cognito-user-pools-app-ui-customization.html)
修改登录的页面。如果不希望使用Cognito提供的登录和注册页面，也可以根据API自己实现。

## 配置Alexa Account Linking
此章节将配置Alex Account Linking, 这里假设已经创建了一个*Alexa SkillSet*或者*Alexa SmartHome Skill*。

1. 登录[Alexa 控制台](https://developer.amazon.com/alexa/console/ask)。

2. 在 **Skills** 列表页中，选择需要做账户关联的技能。

3. 在左侧页面导航栏中，选择 **Account Linking**。

4. 打开"是否允许账号"的开关。

5. 在 **Security Provider Information** 中，选择 **Auth Code Grant**。

6. 在 **Authorization URI** 中，指定 `https://<your-cognito-domain>/oauth2/authorize`。

7. 在 **Access Token URI** 中，指定 `https://<your-cognito-domain>/oauth2/token`。

8. 在 **Client ID** 中，指定 Cognito 应用程序客户端的**应用程序客户端 ID**。

 > 在**Cognito控制台**左侧选择**应用程序客户端**, 点击**显示详细信息**，可以查看**应用程序客户端 ID**和**应用程序客户端密钥**。

 ![App Client](http://cdn.quickstart.org.cn/assets/alexa/account-linking/app-client.png)

9. 在**Client Secret**，指定Cognito应用程序客户端的**应用程序客户端密钥**。

 ![Alexa Account Linking](http://cdn.quickstart.org.cn/assets/alexa/account-linking/alexa-account-linking.png)

10. 在页面左上角，选择**Save**。

11. （可选）如果是 Custom Skill, 需要重新 Build Skill。选择左侧页面导航栏中的 **CUSTOM**, 选择 **Invocation**, 
点击 **Build Model** 按钮，等待 **Build Success** 的提示。

关于更多 Cognito OAuth2.0 的 URI, 请参考[Amazon Cognito 用户池 Auth API 参考](https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html)

## 在Alexa App中绑定用户身份

### 创建测试用户

1. 打开 [Amazon Cognito Console](https://console.aws.amazon.com/cognito/home)。

2. 选择刚才创建的用户池。

3. 在页面左侧导航栏中，选择**用户和组**。

4. 选择**创建用户**，并指定**用户名**, **临时密码**, **电话号码**及**电子邮件**，并选择创建用户。

 ![测试用户](http://cdn.quickstart.org.cn/assets/alexa/account-linking/demo-user.png)

### 账户关联

 > Alexa APP的登录账号，必须和登录Alexa Developer控制台的账号相同，才能看见开发中的Alexa技能。

1. 在手机上打开 Alexa APP, 或者使用 [Alexa Web Portal](https://alexa.amazon.com/spa/index.html)。

2. 在 APP 左上角，选择"汉堡"按钮。

3. 在左侧导航栏页面中，选择 **Skills**。

4. 在 **All Skills** 页面右上角，选择 **Your Skills**。

5. 在 **Your Skills** 页面，选择 **DEV SKILLS**, 此处将列出所有开发中的技能。

6. 选择创建的 Alexa 技能，在详情页，选择 **Enable**。如果已经显示为 **Enable**，可以先选择 **Disable** 之后，再次 **Enable**。

7. 在弹出的登录页面中，输入 Cognito User Pool 中用户账号和密码。

8. (可选) Cognito User Pool 在第一次登录之后，需要修改初始密码。

9. 账户关联成功。

 ![](http://cdn.quickstart.org.cn/assets/alexa/account-linking/link-success.png)

此时，账号已经关联成功，Alexa 在后续发送给 HTTP Endpoint 或者 AWS Lambda 的消息体中均会包含用户的 **accessToken**, 
该 **accessToken** 为 JWT 格式。Alexa 发送的 JWT token 中的 **sub** 字段就是 Cognito User Pool 中的用户名。

## 更多阅读
[Understand Account Linking](https://developer.amazon.com/docs/account-linking/understand-account-linking.html)

[The OAuth2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)

[JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)

[AWS Cognito User Pool](https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/cognito-user-identity-pools.html)
