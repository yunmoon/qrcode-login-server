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
#### 配置文件说明
配置文件地址 src/configs/config.ts
```typescript
export let mongo = {
    url: 'mongodb://127.0.0.1:27017/qrcode-server' // mongodb连接地址
};

export let qrcode = {
    expire: 60000 //单位毫秒,有效时间
}

export let mqtt = {
    url: 'mqtt://192.168.0.195:1883' // mqtt连接地址
}

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


#### 接口签名说明
##### 1\.计算步骤
> 用于计算签名的参数在不同接口之间会有差异，但算法过程固定如下4个步骤。

- 1.将<key, value>请求参数对按key进行字典升序排序，得到有序的参数对列表N

- 2.将列表N中的参数对按URL键值对的格式拼接成字符串，得到字符串T（如：key1=value1&key2=value2），URL键值拼接过程value部分需要URL编码，URL编码算法用大写字母，例如%E8，而不是小写%e8

- 3.将应用密钥以app_key为键名，组成URL键值拼接到字符串T末尾，得到字符串S（如：key1=value1&key2=value2&app_key=密钥)

- 4.对字符串S进行MD5运算，将得到的MD5值所有字符转换成大写，得到接口请求签名

##### 2\.注意事项
- 1.不同接口要求的参数对不一样，计算签名使用的参数对也不一样
- 2.参数名区分大小写，参数值为空不参与签名
- 3.URL键值拼接过程value部分需要URL编码
- 4.签名有效期5分钟，需要请求接口时刻实时计算签名信息

##### 3\.参考代码（php）
```php
// getReqSign ：根据 接口请求参数 和 应用密钥 计算 请求签名
// 参数说明
//   - $params：接口请求参数（特别注意：不同的接口，参数对一般不一样，请以具体接口要求为准）
//   - $appkey：应用密钥
// 返回数据
//   - 签名结果
function getReqSign($params /* 关联数组 */, $appkey /* 字符串*/)
{
    // 1. 字典升序排序
    ksort($params);

    // 2. 拼按URL键值对
    $str = '';
    foreach ($params as $key => $value)
    {
        if ($value !== '')
        {
            $str .= $key . '=' . urlencode($value) . '&';
        }
    }

    // 3. 拼接app_key
    $str .= 'app_key=' . $appkey;

    // 4. MD5运算，得到请求签名
    return md5($str);
}
```
