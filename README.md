# Moe-Counter

多种风格可选的萌萌计数器-vercel专用版本(module.exports对象方法)[无延迟计数]

![Moe-Counter](https://moe-counter-mongo-grbnb.vercel.app/get/@Moe-Counter)

<details>
<summary>More theme</summary>

##### asoul
![asoul](https://count.getloli.com/get/@demo?theme=asoul)

##### moebooru
![moebooru](https://count.getloli.com/get/@demo?theme=moebooru)

##### rule34
![Rule34](https://count.getloli.com/get/@demo?theme=rule34)

##### gelbooru
![Gelbooru](https://count.getloli.com/get/@demo?theme=gelbooru)</details>

## Demo
[https://count.getloli.com](https://count.getloli.com)

## Usage

### Install

#### Run on Vercel

- Click the Button [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/grbnb/moe-counter-vercel/tree/vercel-req&env=DB_URL,DB_UPSERT,VIEW_LEN&envDescription=🧡💘💖&envLink=https://github.com/grbnb/moe-counter-vercel/tree/vercel-req#environment-variables)
- Just hit the **Github** button
- Fill in the **Repository Name** blank
- And fill in **environment-variables** value
- Hit the **Deploy** button

### Environment Variables

| Key                | Description                                                                           |
| ------------------ | ------------------------------------------------------------------------------------- |
| DB_URL             | `mongodb+srv://account:passwd@***.***.***.mongodb.net/db_count` **MongoDB login**: [mongodb](https://cloud.mongodb.com)|
| DB_UPSERT          | [Insert new document]`true`or`false`, default=`false`(Update only existing documents) |
| VIEW_LEN           | [Moe-Counter display length] set scope `5-18` , default=`7`                           |


## Credits

*   [journey-ad](https://github.com/journey-ad/Moe-Counter)
*   [anyfan](https://github.com/anyfan/MoeCount_vercel)


## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjourney-ad%2FMoe-Counter.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjourney-ad%2FMoe-Counter?ref=badge_large)
