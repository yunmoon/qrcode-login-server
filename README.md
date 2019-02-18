## 二维码登录服务

### 安装使用

#### 获取代码

```bash
git clone https://github.com/yunmoon/qrcode-login-server.git
```

#### 运行程序
安装扩展包
```bash
npm i
```
开发模式
```bash
npm run build:live
```
生产模式
```bash
npm run start
```

#### 接口说明
##### 1\. 创建应用接口
###### 接口功能 
> 创建应用 获取appId 和 appSecret
###### URL地址
> /app/create
###### HTTP请求方式
> POST 
###### 请求参数
> |参数|必选|类型|说明|
> |:-----  |:-------|:-----|-----  |
> |appName    |ture    |string|应用名称 |
> |description    |ture    |string|应用描述 |
> |appDownloadUrl    |ture    |string|应用下载地址 |

###### 返回结果
```json
{
    "status": 1,
    "message": "创建成功",
    "data": {
        "appName": "appName",
        "appSecret": "appSecret",
        "appId": "appId",
        "description": "description",
        "appDownloadUrl": "appDownloadUrl",
        "created": "created"
    }
}
```
###### 返回参数
>|返回字段|字段类型|说明                              |
>|:-----   |:------|:-----------------------------   |
>|appName   |string    |应用名称 |
>|appSecret   |string    |应用appSecret |
>|appId   |string    |应用appId |
>|appDownloadUrl    |string|应用下载地址 |
>|created    |string|应用创建时间 |


##### 2\. 获取二维码内容
###### 接口功能 
> 获取二维码内容
###### URL地址
> /getQrcode
###### HTTP请求方式
> GET 
###### 签名方法
> 请参考通用 API 接口签名规则
###### 请求参数
> |参数|必选|类型|说明|
> |:-----  |:-------|:-----|-----  |
> |app_id    |ture    |string|应用ID |
> |time_stamp    |ture    |string|时间戳 |
> |nonce_str    |ture    |string|随机数 |
> |sign    |ture    |string|签名 |
###### 返回结果
```json
{
    "status": 1,
    "message": "获取成功",
    "data": {
        "qrcode": "http://host/qrcode/id",
        "expire": ""
    }
}
```
###### 返回参数
>|返回字段|字段类型|说明                              |
>|:-----   |:------|:-----------------------------   |
>|qrcode   |string    |二维码验证地址 |
>|expire   |number    |二维码过期时间 |


##### 3\. 验证二维码
###### 接口功能 
> 验证二维码
###### URL地址
> /qrcode/:id
###### HTTP请求方式
> POST 
###### 请求参数
> |参数|必选|类型|说明|
> |:-----  |:-------|:-----|-----  |
> |app_id    |ture    |string|应用ID |
> |action    |ture    |string|操作类型（scan扫描,confirm确认,cancel取消） |
> |loginData    |ture    |object|登录信息 |
###### 返回结果
```json
{
    "status": 1,
    "message": "操作成功",
    "data": {
    }
}
```
###### 返回参数
