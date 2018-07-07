# 2018 WORLD CUP STAR VOTE
2018世界杯你最喜爱球星投票——区块链DApp

## 项目概述
2018世界杯+区块链会碰撞出什么火花！！

在这里，你可以为你喜欢的球星投票助威！！

整个投票过程使用智能合约控制，完全的去中心化，你可以在区块链上查看到每一次投票的记录！！

在🍺啤酒+小龙虾的狂欢中，率先体验去中心化DApp的魅力！

## 项目最终效果

## 开始之前

你需要准备

* npm（这个不做另外介绍了，自行百度吧）
* Truffle(DApp开发框架）`nmp install -g truffle`
* Ganache(本地调试环境，对，因为本人习惯和Ganache使用方便，我选择了先用以太坊环境调试我们的智能合约。用Ganache调试我们智能合约代码的过程这里不展开了，想了解的可以去百度一下）[这里下载](https://truffleframework.com/ganache)
* MOAC Pangu 0.8.2 [这里下载](https://github.com/MOACChain/moac-core/releases)
* 还有Chain3 JavaScript API （熟悉Web3的话，Chain3应该很容易上手）[文档](https://github.com/MOACChain/chain3/blob/master/Chain3.md)

## 实现步骤

###1、使用Truffle Boxes搭建我们的DApp框架

```
$ mkdir WorldCupStarVote

$ cd WorldCupStarVote

$ truffle unbox react
Downloading...
Unpacking...
Setting up...
Unbox successful. Sweet!

Commands:

  Compile:              truffle compile
  Migrate:              truffle migrate
  Test contracts:       truffle test
  Test dapp:            npm test
  Run dev server:       npm run start
  Build for production: npm run build

```

安装成功后，我们运行Ganache，修改truffle.js文件，试试运行

```
$ truffle migrate
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/SimpleStorage.sol...
Writing artifacts to ./build/contracts

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x71542865d80549a2e60e79f1c19462a57104863911f52d7b6807948e49950856
  Migrations: 0x08e900321b8de7ab7856e3052b4a030522c39e01
Saving successful migration to network...
  ... 0x2ba553b7d9e4a0f6a6eacbe4ede9c0342c2b98c0b5480f84ba9679b2c23b5e55
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying SimpleStorage...
  ... 0x1a5f4afa297bdfe4515335c874a6f0353638df386cd2432e62f16d1281709b8e
  SimpleStorage: 0x7c016c1e6037c404ede326e8afd5447339584670
Saving successful migration to network...
  ... 0x865fd68055b1e1cf78ea8935f1ed99b9b07a494429e73ef2dd6f3d2634607842
Saving artifacts...

$ npm run start
```

如无意外，http://localhost:3000/ 应该能看见我们的网页了。

###2、使用npm安装chain3

```
npm install --save chain3
```

###3、编写智能合约
首先我们删除掉SimpleStorage.sol。

接着创建我们的投票智能合约；相关内容见代码注释 `touch contracts/Vote.sol`

修改`2_deploy_contracts.js`文件

```
var Vote = artifacts.require("./Vote.sol");

module.exports = function(deployer) {
  deployer.deploy(Vote);
};

```

###4、修改项目的.html、.js、.css文件内容
详细内容请查看

* app.js
* app.css
* getChain3.js


###5、部署合约到MOAC测试网

具体步骤可以看[这篇文章](https://mp.weixin.qq.com/s/e8LRSaEsVaLgwAJgLW4wPg)


###6、运行本地节点（测试网）

`./moac --testnet --rpc --rpccorsdomain "*"`

## 你可能遇到的问题




