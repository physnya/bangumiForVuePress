> [!WARNING]
>
> 正在开发中.

这是一个 Vue 组件和与之相关的 pre-commit 脚本，用来在 VuePress 网站上展示 bangumi 用户的观看记录，需要 bangumi ID ([Bangumi 番组计划](https://bgm.tv/)).

## 前置说明

首先，我的 VuePress 站点的文件目录大致如下：

```bash
blog
├─ .env
├─ package-lock.json
├─ package.json
│
├─ .husky
│  ├─ pre-commit
│  │
│  └─ _
│     ├─ .gitignore
│     └─ husky.sh
│
├─ docs
│  ├─ article.md
│  │
│  └─ .vuepress
│      ├─ client.ts
│      ├─ config.ts
│      ├─ custom.css
│      │
│      ├─ components
│          ├─ bangumi.vue
│      │
│      ├─ public
│      │   ├─ bangumi.json
│      │
│      └─ theme
├─ node_modules
└─ scripts
     ├─ fetch-bangumi.cjs
     └─ pre-commit.cjs
```

因此我的操作是基于上面文件结构进行的，如果要使用，建议先检查文件结构或者适配自己的项目.

另外，本项目基于 VuePress，但是其逻辑比较简单，可以非常容易地适配其他的静态站点生成器，若有需要可以自行修改.

## 使用

首先在项目中安装 husky：

```bash
pnpm add --save-dev husky
pnpm exec husky init
```

在生成的 ``.husky/`` 目录下的 ``pre-commit`` 文件中做如下修改：

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running pre-commit tasks..."
pnpm precommit
```

之后将 ``fetch-bangumis.cjs`` 和 ``pre-commit.cjs`` 放到根目录的 ``scripts/`` 下. 同时在根目录下新建密钥文件 ``.env``，在其中写入：

```
BANGUMI_USER_NAME=YOUR_BANGUMI_USER_NAME
```

其中的 ``YOUR_BANGUMI_USER_NAME`` 写入你的 bangumi user ID，记住在 ``.gitignore`` 中添加 ``.env``，否则会造成自己的用户名泄露.

---

将 Vue 组件放入 ``componets/`` 文件夹，VuePress 会自动注册组件.

